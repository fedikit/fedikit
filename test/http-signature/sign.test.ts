import { assertEquals } from 'std/assert/mod.ts'

import {
  generateKey,
  sign,
  signatureHeaderToObject,
} from '../../src/http-signature/mod.ts'
import { decodeBase64, subtle } from '../../src/http-signature/deps.ts'

Deno.test('sign', async () => {
  const keyPair = await generateKey()

  let req = new Request(
    'https://mastodon.example/users/username/inbox',
    {
      method: 'POST',
      body: JSON.stringify({
        '@context': 'https://www.w3.org/ns/activitystreams',
        'actor': 'https://example.com/actor',
        'type': 'Create',
        'object': {
          'type': 'Note',
          'content': 'Hello!',
        },
        'to': 'https://mastodon.example/users/username',
      }),
    },
  )

  req = await sign(req, {
    key: keyPair.privateKey,
    keyId: 'https://mastodon.example/users/username#main-key',
  })

  const { signature } = signatureHeaderToObject(req.headers.get('signature')!)

  const signatureArrayBuffer = decodeBase64(signature)

  const { pathname, search } = new URL(req.url)
  const data = Object.entries({
    '(request-target)': `${req.method.toLowerCase()} ${pathname}${search}`,
    host: req.headers.get('host'),
    date: req.headers.get('date'),
    digest: req.headers.get('digest'),
  })
    .map((v) => v.join(': '))
    .join('\n')

  const verify = await subtle.verify(
    'RSASSA-PKCS1-v1_5',
    keyPair.publicKey,
    signatureArrayBuffer,
    new TextEncoder().encode(data),
  )

  assertEquals(verify, true)
})
