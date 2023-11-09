import { stringify } from './lib/stringify.ts'
import type { HostMeta } from './lib/types.ts'

export const simpleHostMeta = (req: Request): Response => {
  const accept = req.headers.get('accept')
  const { origin, pathname } = new URL(req.url)

  const hostMeta = {
    links: [{
      rel: 'lrdd',
      type: 'application/jrd+json',
      template: new URL('/.well-known/webfinger?resource={uri}', origin).href,
    }],
  } satisfies HostMeta

  if (
    ['.json', '.jrd'].some((ext) => pathname.endsWith(ext)) ||
    accept?.includes('json')
  ) {
    return new Response(
      JSON.stringify(hostMeta),
      { headers: { 'content-type': 'application/json; charset=utf-8' } },
    )
  } else {
    return new Response(
      stringify(hostMeta),
      { headers: { 'content-type': 'application/xrd+xml; charset=utf-8' } },
    )
  }
}
