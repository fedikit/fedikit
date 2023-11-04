// TODO: (created), (expires)
// TODO: headers options

import {
  bodyToDigestHeader,
  objectToSignatureHeader,
  objectToSigningString,
} from './lib/headers.ts'

export type SignOptions = {
  key: CryptoKey
  /** @example `https://my-example.com/actor#main-key` */
  keyId: string
}

export const sign = async (
  req: Request,
  { key, keyId }: SignOptions,
): Promise<Request> => {
  const { pathname, host, search } = new URL(req.url)

  let digest: string | undefined = undefined

  if (!req.headers.has('Date')) {
    req.headers.set('Date', new Date().toUTCString())
  }

  if (!req.headers.has('Host')) {
    req.headers.set('Host', host)
  }

  if (req.method === 'POST' && req.body) {
    digest = await bodyToDigestHeader(JSON.stringify(req.body))
    req.headers.set('Digest', digest)
  }

  const signed = {
    '(request-target)': `${req.method.toLowerCase()} ${pathname}${search}`,
    host: req.headers.get('host'),
    date: req.headers.get('date'),
    ...(digest ? { digest } : {}),
  }

  const signature = await objectToSigningString(signed, key)

  const signatureHeader = objectToSignatureHeader({
    algorithm: 'hs2019',
    keyId,
    headers: Object.keys(signed).join(' '),
    signature,
  })

  req.headers.set('Signature', signatureHeader)

  return req
}
