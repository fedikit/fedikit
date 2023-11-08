import { extractSubject } from './lib/subject.ts'
import type { Webfinger } from './lib/types.ts'

export type SimpleWebfingerHandler = (params: {
  /** @example `acct:carol@example.com` */
  subject: string
  /** @example `carol` */
  user: string
  /** @example `example.com` */
  host: string
}) => string | Promise<string> | undefined

export const simpleWebfinger = async (
  req: Request,
  handler: string | SimpleWebfingerHandler,
): Promise<Response> => {
  const { searchParams } = new URL(req.url)

  const subject = searchParams.get('resource')

  if (!subject) return new Response('missing field `resource`', { status: 400 })

  const { user, host } = extractSubject(subject)

  if (!user || !host) return new Response('invalid acct', { status: 400 })

  const href = typeof handler === 'string'
    ? handler
    : await handler({ subject, user, host })

  if (!href) return new Response('not found', { status: 404 })

  const webfinger = {
    subject,
    aliases: [href],
    links: [{
      href,
      rel: 'http://webfinger.net/rel/profile-page',
      type: 'text/html',
    }, {
      href,
      rel: 'self',
      type: 'application/activity+json',
    }],
  } satisfies Webfinger

  return new Response(JSON.stringify(webfinger), {
    headers: {
      'content-type': 'application/jrd+json; charset=utf-8',
    },
  })
}
