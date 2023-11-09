/** {@link https://json.schemastore.org/host-meta.json} */
export type HostMeta = {
  subject: string
  expires?: string
  aliases?: string[]
  properties?: HostMetaProperties
  links?: HostMetaLink[]
} & Record<string, unknown>

export type HostMetaProperties = Record<string, string | null>

export type HostMetaLink = {
  rel?: string
  type?: string
  href?: string
  template?: string
  titles?: {
    default?: string
  } & Record<string, string | undefined>
  properties?: HostMetaProperties
} & Record<string, unknown>
