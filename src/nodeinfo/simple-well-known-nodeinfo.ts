import { WellKnownNodeInfo } from './lib/types.ts'

export const simpleWellKnownNodeInfo = (url: URL): Response =>
  new Response(
    JSON.stringify(
      {
        links: [{
          rel: 'http://nodeinfo.diaspora.software/ns/schema/2.0',
          href: new URL('/nodeinfo/2.0', url).href,
        }, {
          rel: 'http://nodeinfo.diaspora.software/ns/schema/2.1',
          href: new URL('/nodeinfo/2.1', url).href,
        }],
      } satisfies WellKnownNodeInfo,
    ),
    {
      headers: {
        'content-type': 'application/json',
      },
    },
  )
