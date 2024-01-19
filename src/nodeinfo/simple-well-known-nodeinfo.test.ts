import { assertEquals } from '../deps/std/assert.ts'
import { Hono } from '../deps/hono.ts'
import { simpleWellKnownNodeInfo } from './mod.ts'

Deno.test('GET /.well-known/nodeinfo (localhost)', async () => {
  const app = new Hono()
  app.get(
    '/.well-known/nodeinfo',
    ({ req }) => simpleWellKnownNodeInfo(new URL(req.raw.url).origin),
  )

  const expectedWellKnownNodeInfo = {
    links: [
      {
        rel: 'http://nodeinfo.diaspora.software/ns/schema/2.0',
        href: 'http://localhost/nodeinfo/2.0',
      },
      {
        rel: 'http://nodeinfo.diaspora.software/ns/schema/2.1',
        href: 'http://localhost/nodeinfo/2.1',
      },
    ],
  }

  const res = await app.request('/.well-known/nodeinfo')

  assertEquals(res.status, 200)
  assertEquals(await res.json(), expectedWellKnownNodeInfo)
})

Deno.test('GET /.well-known/nodeinfo (example.com)', async () => {
  const app = new Hono()
  app.get(
    '/.well-known/nodeinfo',
    () => simpleWellKnownNodeInfo('https://example.com'),
  )

  const expectedWellKnownNodeInfo = {
    links: [
      {
        rel: 'http://nodeinfo.diaspora.software/ns/schema/2.0',
        href: 'https://example.com/nodeinfo/2.0',
      },
      {
        rel: 'http://nodeinfo.diaspora.software/ns/schema/2.1',
        href: 'https://example.com/nodeinfo/2.1',
      },
    ],
  }

  const res = await app.request('/.well-known/nodeinfo')

  assertEquals(res.status, 200)
  assertEquals(await res.json(), expectedWellKnownNodeInfo)
})
