import { decodeBase64, encodeBase64, subtle } from '../deps.ts'

const shared = {
  beginPublic: '-----BEGIN PUBLIC KEY-----',
  beginPrivate: '-----BEGIN PRIVATE KEY-----',
  endPublic: '-----END PUBLIC KEY-----',
  endPrivate: '-----END PRIVATE KEY-----',
}

type PartialActor = {
  publicKey: {
    id: string
    owner: string
    publicKeyPem: string
  }
}

export type GenerateKeyOptions = {
  modulusLength?: 2048 | 3072 | 4096
}

export type ImportKeyOptions = {
  extractable?: boolean
}

export const generateKey = async (
  { modulusLength }: GenerateKeyOptions = {},
): Promise<CryptoKeyPair> =>
  await subtle.generateKey(
    {
      name: 'RSASSA-PKCS1-v1_5',
      modulusLength: modulusLength ?? 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: { name: 'SHA-256' },
    },
    true,
    ['sign', 'verify'],
  )

export const exportPublicKey = async (
  { publicKey }: CryptoKeyPair,
): Promise<string> => {
  const keyArrayBuffer = await subtle.exportKey('spki', publicKey)
  const keyBase64 = encodeBase64(new Uint8Array(keyArrayBuffer))
    .match(/.{1,64}/g)
    ?.join('\n')

  return [
    shared.beginPublic,
    keyBase64,
    shared.endPublic,
  ].join('\n')
}

export const exportPrivateKey = async (
  { privateKey }: CryptoKeyPair,
): Promise<string> => {
  const keyArrayBuffer = await subtle.exportKey('pkcs8', privateKey)
  const keyBase64 = encodeBase64(new Uint8Array(keyArrayBuffer))
    .match(/.{1,64}/g)
    ?.join('\n')

  return [
    shared.beginPrivate,
    keyBase64,
    shared.endPrivate,
  ].join('\n')
}

export const importPublicKey = async (
  keyString: string,
  { extractable }: ImportKeyOptions = {},
): Promise<CryptoKey> => {
  const keyBase64 = keyString
    .trim()
    .replaceAll('\n', '')
    .slice(
      shared.beginPublic.length,
      -shared.endPublic.length,
    )

  const keyArrayBuffer = decodeBase64(keyBase64)

  return await subtle.importKey(
    'spki',
    keyArrayBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' },
    },
    extractable ?? false,
    ['verify'],
  )
}

export const importPrivateKey = async (
  keyString: string,
  { extractable }: ImportKeyOptions = {},
): Promise<CryptoKey> => {
  const keyBase64 = keyString
    .trim()
    .replaceAll('\n', '')
    .slice(
      shared.beginPrivate.length,
      -shared.endPrivate.length,
    )

  const keyArrayBuffer = decodeBase64(keyBase64)

  return await subtle.importKey(
    'pkcs8',
    keyArrayBuffer,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: { name: 'SHA-256' },
    },
    extractable ?? false,
    ['sign'],
  )
}

export const fetchPublicKey = async (
  keyId: string,
  options: ImportKeyOptions = {},
) =>
  await importPublicKey(
    await fetch(keyId, {
      headers: {
        Accept: 'application/activity+json',
      },
    })
      .then((res) => res.json() as unknown as PartialActor)
      .then(({ publicKey }) => publicKey.publicKeyPem),
    options,
  )
