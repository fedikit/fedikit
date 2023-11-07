import type { WellKnownNodeInfo } from './lib/types.ts'

export const simpleWellKnownNodeInfo = (base: string | URL): Response =>
  new Response(
    JSON.stringify(
      {
        links: [{
          rel: 'http://nodeinfo.diaspora.software/ns/schema/2.0',
          href: new URL('/nodeinfo/2.0', base).href,
        }, {
          rel: 'http://nodeinfo.diaspora.software/ns/schema/2.1',
          href: new URL('/nodeinfo/2.1', base).href,
        }],
      } satisfies WellKnownNodeInfo,
    ),
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  )
