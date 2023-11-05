import { assertEquals } from 'std/assert/mod.ts'

import {
  exportPrivateKey,
  exportPublicKey,
  fetchPublicKey,
  generateKey,
  importPrivateKey,
  importPublicKey,
} from '../../../src/http-signature/lib/key.ts'

// fail in Node.js
Deno.test({
  name: 'generate / export / import',
  // @ts-ignore only used to detect node.js
  ignore: globalThis?.process?.release?.name === 'node',
  fn: async () => {
    const keyPair = await generateKey()

    const publicKeyString = await exportPublicKey(keyPair)
    const privateKeyString = await exportPrivateKey(keyPair)

    const publicKey = await importPublicKey(publicKeyString, {
      extractable: true,
    })
    const privateKey = await importPrivateKey(privateKeyString, {
      extractable: true,
    })

    assertEquals(keyPair.publicKey, publicKey)
    assertEquals(keyPair.privateKey, privateKey)
  },
})

Deno.test('importPublicKey / fetchPublicKey', async () => {
  /** from {@link https://github.com/LemmyNet/lemmy/blob/main/crates/apub/assets/mastodon/objects/person.json} */
  const mastodonPublicKeyImport = await importPublicKey(
    `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtBdE55VmV9gTrhJmRF1K
eX7xTRo17JGQ7d1/KJWsQ1zH62GGeG/E+BG3h/BRtfgI7Z9jwfNEyx8g/Ue8rSeZ
3M7yc09/Z90uwGVY24hxwAJyzWIN2cv5ayhdtk268byT6NX98a9PQcHlx5i6Bhef
MlpY73I5gxYlofvwJTHq/VupXVw9K76KId2AgR2z8tLiXPc8TED56HulDWdMlWn3
9B4mWNYmzMBF7lOl58Ws6bFsiv8GnI3uEywzUGhXqz4242FGveHdAGBaCpUYrm8W
mT8PArqv3B4fCD1ghakSmxRr3y9clwhkC+kB/aoT6z313uZYbQuvZF1bfbh6EZWm
IQIDAQAB
-----END PUBLIC KEY-----`,
  )
  const mastodonPublicKeyFetch = await fetchPublicKey(
    'https://raw.githubusercontent.com/LemmyNet/lemmy/main/crates/apub/assets/mastodon/objects/person.json#main-key',
  )

  /** from {@link https://github.com/LemmyNet/lemmy/blob/main/crates/apub/assets/pleroma/objects/person.json} */
  const pleromaPublicKeyImport = await importPublicKey(
    `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsWOgdjSMc010qvxC3njI
XJlFWMJ5gJ8QXCW/PajYdsHPM6d+jxBNJ6zp9/tIRa2m7bWHTSkuHQ7QthOpt6vu
+dAWpKRLS607SPLItn/qUcyXvgN+H8shfyhMxvkVs9jXdtlBsLUVE7UNpN0dxzqe
I79QWbf7o4amgaIWGRYB+OYMnIxKt+GzIkivZdSVSYjfxNnBYkMCeUxm5EpPIxKS
P5bBHAVRRambD5NUmyKILuC60/rYuc/C+vmgpY2HCWFS2q6o34dPr9enwL6t4b3m
S1t/EJHk9rGaaDqSGkDEfyQI83/7SDebWKuETMKKFLZi1vMgQIFuOYCIhN6bIiZm
pQIDAQAB
-----END PUBLIC KEY-----`,
  )
  const pleromaPublicKeyFetch = await fetchPublicKey(
    'https://github.com/LemmyNet/lemmy/raw/main/crates/apub/assets/pleroma/objects/person.json',
  )

  assertEquals(mastodonPublicKeyImport, mastodonPublicKeyFetch)
  assertEquals(pleromaPublicKeyImport, pleromaPublicKeyFetch)
})
