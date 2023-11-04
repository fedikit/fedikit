import { encodeBase64, subtle } from '../deps.ts'

/** {@link https://datatracker.ietf.org/doc/html/draft-cavage-http-signatures-12#section-4.1.1} */
export type Signature = {
  keyId: string
  algorithm: string
  created?: number
  expires?: number
  headers: string[]
  signature: string
}

export const bodyToDigestHeader = async (body: string): Promise<string> =>
  `SHA-256=${
    encodeBase64(
      new Uint8Array(
        await subtle.digest(
          'SHA-256',
          new TextEncoder().encode(body),
        ),
      ),
    )
  }`

export const objectToSignatureHeader = (obj: Record<string, unknown>) =>
  Object.entries(obj)
    .map(([key, value]) => `${key}="${value}"`)
    .join(',')

export const signatureHeaderToObject = (signatureHeader: string): Signature => {
  const signature = Object.fromEntries(
    signatureHeader
      .split(',')
      .map((kv) => {
        const [key, ...values] = kv.split('=')
        let value = values.join('=')
        if (value.startsWith('"')) value = value.slice(1, -1) // remove "
        return [key, value]
      }),
  )

  return {
    keyId: signature.keyId,
    algorithm: signature.algorithm,
    created: signature.created ? +signature.created : undefined,
    expires: signature.expires ? +signature.expires : undefined,
    headers: signature.headers.split(' '),
    signature: signature.signature,
  }
}

export const objectToSigningString = async (
  obj: Record<string, unknown>,
  key: CryptoKey,
) =>
  encodeBase64(
    new Uint8Array(
      await subtle.sign(
        'RSASSA-PKCS1-v1_5',
        key,
        new TextEncoder().encode(
          Object.entries(obj)
            .map((v) => v.join(': '))
            .join('\n'),
        ),
      ),
    ),
  )
