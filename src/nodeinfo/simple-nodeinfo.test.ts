import { assertEquals } from '../deps/std/assert.ts'
import { Hono } from '../deps/hono.ts'
import { type NodeInfo, simpleNodeInfo } from './mod.ts'

const app = new Hono()

app.get('/nodeinfo/*', ({ req }) =>
  simpleNodeInfo(req.raw, {
    software: {
      name: 'fedikit',
      version: '0.0.1',
      repository: 'https://github.com/fedikit/fedikit.git',
      homepage: 'https://github.com/fedikit/fedikit#readme',
    },
  }))

const expectedNodeInfo21 = {
  version: '2.1',
  software: {
    name: 'fedikit',
    version: '0.0.1',
    repository: 'https://github.com/fedikit/fedikit.git',
    homepage: 'https://github.com/fedikit/fedikit#readme',
  },
  protocols: ['activitypub'],
  services: {
    inbound: [],
    outbound: [],
  },
  openRegistrations: false,
  usage: {
    users: {},
  },
  metadata: {},
} satisfies NodeInfo<'2.1'>

const expectedNodeInfo20 = {
  version: '2.0',
  software: {
    name: 'fedikit',
    version: '0.0.1',
  },
  protocols: ['activitypub'],
  services: {
    inbound: [],
    outbound: [],
  },
  openRegistrations: false,
  usage: {
    users: {},
  },
  metadata: {},
} satisfies NodeInfo<'2.0'>

Deno.test('GET /nodeinfo/2.1', async () => {
  const res = await app.request('/nodeinfo/2.1')

  assertEquals(res.status, 200)
  assertEquals(await res.json(), expectedNodeInfo21)
})

Deno.test('GET /nodeinfo/2.0', async () => {
  const res = await app.request('/nodeinfo/2.0')

  assertEquals(res.status, 200)
  assertEquals(await res.json(), expectedNodeInfo20)
})
