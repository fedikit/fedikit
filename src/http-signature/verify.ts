import {
  bodyToDigestHeader,
  objectToSigningString,
  signatureHeaderToObject,
} from './lib/headers.ts'
import { fetchPublicKey } from './lib/key.ts'

export type VerifyOptions = {
  allowedMsInThePast?: number
  allowedMsInTheFuture?: number
  requiredHeaders?: ('date' | 'digest' | 'host')[]
}

export const verify = async (
  req: Request,
  options: VerifyOptions = {},
): Promise<true> => {
  const allowedMsInThePast = options.allowedMsInThePast ?? 12 * 3_600_000 // 12 hours
  const allowedMsInTheFuture = options.allowedMsInTheFuture ?? 600_000 // 10 minutes
  const requiredHeaders =
    options.requiredHeaders?.map((header) => header.toLowerCase()) ?? []

  // check signature header (required)
  const signatureHeader = req.headers.get('Signature')
  if (!signatureHeader) throw new Error('Signature header is required')

  console.log(signatureHeader)

  // check signature
  const { keyId, headers, signature, created, expires } =
    signatureHeaderToObject(signatureHeader)
  const { pathname, search } = new URL(req.url)
  const key = await fetchPublicKey(keyId)
  const expectedSignature = await objectToSigningString(
    Object.fromEntries(
      headers.map((header) => [
        header,
        header === '(request-target)'
          ? `${req.method.toLowerCase()} ${pathname}${search}`
          : header === '(created)'
          ? created
          : header === '(expires)'
          ? expires
          : req.headers.get(header),
      ]),
    ),
    key,
  )

  if (signature !== expectedSignature) {
    throw new Error(`Bad Signature ${signature}, expected ${expectedSignature}`)
  }

  // check date header
  const dateHeader = req.headers.get('date')
  if (!dateHeader && requiredHeaders.includes('date')) {
    throw new Error('Date header is required')
  }

  // check date
  if (dateHeader) {
    const now = Date.now()
    const sent = new Date(dateHeader).getTime()
    const diffMs = now - sent
    if (-diffMs < -allowedMsInThePast || -diffMs > allowedMsInTheFuture) {
      throw new Error(
        `Bad date ${dateHeader}, diff ${diffMs} is outside the allowed range`,
      )
    }
  }

  // check digest header
  const digestHeader = req.headers.get('digest')
  if (!digestHeader && requiredHeaders.includes('digest')) {
    throw new Error('Digest header is required')
  }

  // check digest
  if (digestHeader) {
    const [digestName, digestValue] = digestHeader.split('=')
    if (digestName === 'SHA-256') {
      const expectedDigestValue = await bodyToDigestHeader(
        JSON.stringify(req.body),
      )
      if (expectedDigestValue !== digestValue) {
        throw new Error(
          `Bad SHA-256 ${digestValue}, expected ${expectedDigestValue}`,
        )
      }
    } else throw new Error(`Digest ${digestName} is not supported`)
  }

  // TODO: check (created), (expired)

  return true
}
