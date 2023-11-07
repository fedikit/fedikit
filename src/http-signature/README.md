# @fedikit/http-signature

Modern alternative to `http-signature`. [WIP]

## About

`@fedikit/http-signature` Using the
[Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API),
currently supported up to
[draft-cavage-http-signatures-12](https://datatracker.ietf.org/doc/html/draft-cavage-http-signatures-12).

- Q: Why is the latest
  [draft-ietf-httpbis-message-signatures](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-message-signatures)
  not supported?
  - A: Most Fediverse apps aren't currently compatible with it, and I'll
    consider implementing it when at least two major app is.
- Q: Why Use the Web Crypto API?
  - A: 0KB! this means that this package can be more lightweight, at the cost of
    having to use async/await.

## Usage

###### Sign

```ts
import { generateKey, sign } from '@fedikit/http-signature'

const keyPair = await generateKey()

let req = new Request('https://post.deno.dev', {
  method: 'POST',
  body: JSON.stringify({
    message: 'Hello world!',
  }),
  headers: {
    'content-type': 'application/json',
  },
})

req = await sign(req, {
  key: keyPair.privateKey,
  keyId: 'rsa-key-1',
})

await fetch(req)
```
