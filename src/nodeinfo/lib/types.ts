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
  // This library doesn't support nodeinfo 1.x
  // | 'http://nodeinfo.diaspora.software/ns/schema/1.1'
  // | 'http://nodeinfo.diaspora.software/ns/schema/1.0'
  // deno-lint-ignore ban-types
  | (string & {})

/** The schema version. */
export type NodeInfoVersions = '2.1' | '2.0'

/** The protocols supported on this server. */
export type NodeInfoProtocols =
  | 'activitypub'
  | 'buddycloud'
  | 'dfrn'
  | 'diaspora'
  | 'libertree'
  | 'ostatus'
  | 'pumpio'
  | 'tent'
  | 'xmpp'
  | 'zot'
  // deno-lint-ignore ban-types
  | (string & {})

/** The third party sites this server can retrieve messages from for combined display with regular traffic. */
export type NodeInfoInboundServices =
  | 'atom1.0'
  | 'gnusocial'
  | 'imap'
  | 'pnut'
  | 'pop3'
  | 'pumpio'
  | 'rss2.0'
  | 'twitter'
  // deno-lint-ignore ban-types
  | (string & {})

/** The third party sites this server can publish messages to on the behalf of a user. */
export type NodeInfoOutboundServices =
  | 'atom1.0'
  | 'blogger'
  | 'buddycloud'
  | 'diaspora'
  | 'dreamwidth'
  | 'drupal'
  | 'facebook'
  | 'friendica'
  | 'gnusocial'
  | 'google'
  | 'insanejournal'
  | 'libertree'
  | 'linkedin'
  | 'livejournal'
  | 'mediagoblin'
  | 'myspace'
  | 'pinterest'
  | 'pnut'
  | 'posterous'
  | 'pumpio'
  | 'redmatrix'
  | 'rss2.0'
  | 'smtp'
  | 'tent'
  | 'tumblr'
  | 'twitter'
  | 'wordpress'
  | 'xmpp'
  // deno-lint-ignore ban-types
  | (string & {})

export type NodeInfo<T extends NodeInfoVersions = '2.1'> = {
  /** The schema version. */
  version: T
  /** Metadata about server software in use. */
  software: {
    /**
     * The canonical name of this server software.
     * @remarks `/^[a-z0-9-]+$/.test(name)`
     */
    name: string
    /** The version of this server software. */
    version: string
    /** The url of the source code repository of this server software. */
    repository?: T extends '2.1' ? string : never
    /** The url of the homepage of this server software. */
    homepage?: T extends '2.1' ? string : never
  }
  /** The protocols supported on this server. */
  protocols: [NodeInfoProtocols, ...NodeInfoProtocols[]]
  /** The third party sites this server can connect to via their application API. */
  services: {
    /** The third party sites this server can retrieve messages from for combined display with regular traffic. */
    inbound: NodeInfoInboundServices[]
    /** The third party sites this server can publish messages to on the behalf of a user. */
    outbound: NodeInfoOutboundServices[]
  }
  /** Whether this server allows open self-registration. */
  openRegistrations: boolean
  /** Usage statistics for this server. */
  usage: {
    /** statistics about the users of this server. */
    users: {
      /** The total amount of on this server registered users. */
      total?: number
      /** The amount of users that signed in at least once in the last 180 days. */
      activeHalfyear?: number
      /** The amount of users that signed in at least once in the last 30 days. */
      activeMonth?: number
    }
    /** The amount of posts that were made by users that are registered on this server. */
    localPosts?: number
    /** The amount of comments that were made by users that are registered on this server. */
    localComments?: number
  }
  /** Free form key value pairs for software specific values. Clients should not rely on any specific key present. */
  metadata: Record<string, unknown>
}
