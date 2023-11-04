export type WellKnownNodeInfo = {
  links: WellKnownNodeInfoLink[]
}

export type WellKnownNodeInfoLink = {
  rel: WellKnownNodeInfoLinkRel
  href: string
}

export type WellKnownNodeInfoLinkRel =
  | 'http://nodeinfo.diaspora.software/ns/schema/2.1'
  | 'http://nodeinfo.diaspora.software/ns/schema/2.0'
  // | 'http://nodeinfo.diaspora.software/ns/schema/1.1'
  // | 'http://nodeinfo.diaspora.software/ns/schema/1.0'
  // deno-lint-ignore ban-types
  | (string & {})
