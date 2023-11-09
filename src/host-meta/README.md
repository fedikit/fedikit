# @fedikit/host-meta

Implement [Web Host Metadata](https://datatracker.ietf.org/doc/html/rfc6415) in
a simple way.

## Usage

###### `/.well-known/host-meta` `/.well-known/host-meta.*` (simpleHostMeta)

```ts
import { simpleHostMeta } from '@fedikit/webfinger'
import { Hono } from 'hono'

const app = new Hono()

// GET https://example.com/.well-known/host-meta (accept json)
// GET https://example.com/.well-known/host-meta.json
// GET https://example.com/.well-known/host-meta.jrd
// {
//   "links": [
//     {
//       "rel": "lrdd",
//       "type": "application/jrd+json",
//       "template": "https://example.com/.well-known/webfinger?resource={uri}"
//     }
//   ]
// }
// GET https://example.com/.well-known/host-meta
// GET https://example.com/.well-known/host-meta.xrd
// <?xml version="1.0" encoding="UTF-8"?>
// <XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
//   <Link rel="lrdd" type="application/jrd+json" template="http://localhost/.well-known/webfinger?resource={uri}" />
// </XRD>
app
  .get('/.well-known/host-meta', ({ req }) => simpleHostMeta(req.raw))
  .get('/.well-known/host-meta.*', ({ req }) => simpleHostMeta(req.raw))
```
