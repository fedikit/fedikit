# @fedikit/webfinger

Implement Webfinger in a simple way. [WIP]

## Usage

###### /.well-known/webfinger (simpleWebfinger)

```ts
import {
  simpleWebfinger,
  type SimpleWebfingerHandler,
} from '@fedikit/webfinger'
import { Hono } from 'hono'

const app = new Hono()

const handler = ({ user, host }) => `https://${host}/users/${user}`

// GET https://example.com/.well-known/webfinger?resource=acct:carol@example.com
// {
//   "subject": "acct:carol@example.com",
//   "aliases: ["https://example.com/users/carol"]
//   "links": [
//     {
//       "href": "https://example.com/users/carol",
//       "rel": "http://webfinger.net/rel/profile-page",
//       "type": "text/html"
//     },
//     {
//       "href": "https://example.com/users/carol",
//       "rel": "self",
//       "type": "application/activity+json"
//     }
//   ]
// }
app.get(
  '.well-known/webfinger',
  (c) => simpleWebfinger(handler),
)
```
