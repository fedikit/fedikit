# @fedikit/nodeinfo

Implement NodeInfo in a simple way. [WIP]

## Usage

###### /.well-known/nodeinfo (simpleWellKnownNodeInfo)

```ts
import { simpleWellKnownNodeInfo } from '@fedikit/nodeinfo'
import { Hono } from 'hono'

const app = new Hono()

// GET https://example.com/.well-known/nodeinfo
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
  ({ req }) => simpleWellKnownNodeInfo(new URL(req.raw.url).origin),
)
```

###### /nodeinfo/* (simpleNodeInfo)

```ts
import { simpleNodeInfo } from '@fedikit/nodeinfo'
import { Hono } from 'hono'

// {
//   "name": "fedikit",
//   "version: "0.0.1",
//   "repository": {
//     "type": "git",
//     "url": "https://github.com/fedikit/fedikit.git"
//   },
//   "homepage": "https://github.com/fedikit/fedikit#readme"
// }
import pkg from './package.json' assert { type: 'json' }

const app = new Hono()

// GET https://example.com/nodeinfo/2.1
// {
//   "version": "2.1",
//   "software": {
//     "name": "fedikit",
//     "version": "0.0.1",
//     "repository": "https://github.com/fedikit/fedikit.git",
//     "homepage": "https://github.com/fedikit/fedikit#readme"
//   },
//   "protocols": ["activitypub"],
//   "services": {
//     "inbound": [],
//     "outbound": []
//   },
//   "openRegistrations": false,
//   "usage": {
//     "users": {}
//   },
//   "metadata": {}
// }
// GET https://example.com/nodeinfo/2.0
// {
//   "version": "2.0",
//   "software": {
//     "name": "fedikit",
//     "version": "0.0.1",
//   },
//   "protocols": ["activitypub"],
//   "services": {
//     "inbound": [],
//     "outbound": []
//   },
//   "openRegistrations": false,
//   "usage": {
//     "users": {}
//   },
//   "metadata": {}
// }
app.get('/nodeinfo/*', ({ req }) =>
  simpleNodeInfo(req.raw, {
    software: {
      name: pkg.name,
      version: pkg.version,
      repository: pkg.repository.url,
      homepage: pkg.homepage,
    },
  }))
```
