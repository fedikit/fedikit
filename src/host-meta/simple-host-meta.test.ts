import { assertEquals } from 'std/assert/mod.ts'
import { Hono } from 'hono/mod.ts'
import { HostMeta, simpleHostMeta, stringify } from './mod.ts'

const app = new Hono()

app
  .get(
    '/.well-known/host-meta',
    ({ req }) => simpleHostMeta(req.raw),
  )
  .get(
    '/.well-known/host-meta.*',
    ({ req }) => simpleHostMeta(req.raw),
  )

const expectedHostMetaJSON = {
  links: [{
    rel: 'lrdd',
    type: 'application/jrd+json',
    template: 'http://localhost/.well-known/webfinger?resource={uri}',
  }],
} satisfies HostMeta

const expectedHostMetaXRD = stringify(expectedHostMetaJSON)

Deno.test('GET /.well-known/host-meta', async () => {
  const res = await app.request('/.well-known/host-meta')
  assertEquals(res.status, 200)
  assertEquals(await res.text(), expectedHostMetaXRD)
})

Deno.test('GET /.well-known/host-meta (accept json)', async () => {
  const res = await app.request('/.well-known/host-meta', {
    headers: { 'accept': 'application/json' },
  })
  assertEquals(res.status, 200)
  assertEquals(await res.json(), expectedHostMetaJSON)
})

Deno.test('GET /.well-known/host-meta.xrd', async () => {
  const res = await app.request('/.well-known/host-meta.xrd')
  assertEquals(res.status, 200)
  assertEquals(await res.text(), expectedHostMetaXRD)
})

Deno.test('GET /.well-known/host-meta.jrd', async () => {
  const res = await app.request('/.well-known/host-meta.jrd')
  assertEquals(res.status, 200)
  assertEquals(await res.json(), expectedHostMetaJSON)
})

Deno.test('GET /.well-known/host-meta.json', async () => {
  const res = await app.request('/.well-known/host-meta.json')
  assertEquals(res.status, 200)
  assertEquals(await res.json(), expectedHostMetaJSON)
})
