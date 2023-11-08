import { assertEquals } from 'std/assert/mod.ts'
import { Hono } from 'hono/mod.ts'
import { simpleWebfinger } from './mod.ts'

const app = new Hono()

app.get(
  '/.well-known/webfinger',
  ({ req }) =>
    simpleWebfinger(
      req.raw,
      ({ user }) => new URL(`/users/${user}`, new URL(req.raw.url)).href,
    ),
)

const expectedWebfinger = {
  subject: 'acct:carol@example.com',
  aliases: ['http://localhost/users/carol'],
  links: [
    {
      href: 'http://localhost/users/carol',
      rel: 'http://webfinger.net/rel/profile-page',
      type: 'text/html',
    },
    {
      href: 'http://localhost/users/carol',
      rel: 'self',
      type: 'application/activity+json',
    },
  ],
}

Deno.test('GET /.well-known/webfinger?resource=acct:carol@example.com', async () => {
  const res = await app.request(
    '/.well-known/webfinger?resource=acct:carol@example.com',
  )

  assertEquals(res.status, 200)
  assertEquals(await res.json(), expectedWebfinger)
})
