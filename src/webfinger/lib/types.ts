export type Webfinger = {
  subject?: string
  aliases: string[]
  links: WebfingerLink[]
}

export type WebfingerLink = {
  rel: WebfingerLinkRel
  type?: WebfingerLinkType
  href?: string
  template?: string
}

export type WebfingerLinkRel =
  | 'self'
  | 'http://webfinger.net/rel/avatar'
  | 'http://webfinger.net/rel/profile-page'
  | 'http://ostatus.org/schema/1.0/subscribe'
  // deno-lint-ignore ban-types
  | (string & {})

export type WebfingerLinkType =
  | 'text/html'
  | 'application/activity+json'
  // deno-lint-ignore ban-types
  | (string & {})
