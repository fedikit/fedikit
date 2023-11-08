# @fedikit/nodeinfo

Implement NodeInfo in a simple way. [WIP]

## Usage

###### /.well-known/nodeinfo (simpleWellKnownNodeInfo)

```ts
import { simpleWellKnownNodeInfo } from '@fedikit/nodeinfo'
import { Hono } from 'hono'

const app = new Hono()

// {
//   "links": [
//     {
//       "rel": "http://nodeinfo.diaspora.software/ns/schema/2.0",
//       "href": "https://example.com/nodeinfo/2.0"
//     },
//     {
//       "rel": "http://nodeinfo.diaspora.software/ns/schema/2.1",
//       "href": "https://example.com/nodeinfo/2.1"
//     }
//   ]
// }
app.get(
  '.well-known/nodeinfo',
  (c) => simpleWellKnownNodeInfo(new URL(c.req.url).origin),
)
```
