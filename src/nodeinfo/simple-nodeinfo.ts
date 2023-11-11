import type { NodeInfo } from './lib/types.ts'
import { convert } from './lib/convert.ts'

export type SimpleNodeInfoOptions =
  & Pick<NodeInfo, 'software'>
  & Partial<Omit<NodeInfo, 'version' | 'software'>>

export const simpleNodeInfo = (
  req: Request,
  options: SimpleNodeInfoOptions,
): Response => {
  const { pathname } = new URL(req.url)

  let nodeinfo: NodeInfo<'2.0' | '2.1'> = {
    version: '2.1',
    software: options.software,
    protocols: options.protocols ?? ['activitypub'],
    services: {
      inbound: options.services?.inbound ?? [],
      outbound: options.services?.outbound ?? [],
    },
    openRegistrations: options.openRegistrations ?? false,
    usage: {
      ...options.usage,
      users: options.usage?.users ?? {},
    },
    metadata: options.metadata ?? {},
  } satisfies NodeInfo<'2.1'>

  if (pathname.includes('/nodeinfo/2.0')) {
    nodeinfo = convert(nodeinfo as NodeInfo<'2.1'>)
  }

  return new Response(
    JSON.stringify(nodeinfo),
    {
      headers: {
        'content-type':
          'application/json; profile="http://nodeinfo.diaspora.software/ns/schema/2.1#"',
      },
    },
  )
}
