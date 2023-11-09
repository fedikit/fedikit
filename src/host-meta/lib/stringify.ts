import type { HostMeta, HostMetaLink, HostMetaProperties } from './types.ts'

export const stringifyTitles = (titles: HostMetaLink['titles']): string[] =>
  Object.entries(titles ?? {})
    .filter(([, value]) => value)
    .map(([key, value]) =>
      key === 'default'
        ? `    <Title>${value}</Title>`
        : `    <Title xml:lang="${key}">${value}</Title>`
    )

export const stringifyProperties = (
  properties: HostMetaProperties,
  spaces = 2,
): string[] =>
  Object.entries(properties)
    .map(([type, value]) =>
      value === null
        ? `${
          Array.from({ length: spaces }).fill(' ').join('')
        }<Property type="${type}" xsi:nil="true" />`
        : `${
          Array.from({ length: spaces }).fill(' ').join('')
        }<Property type="${type}">${value}</Property>`
    )

export const stringifyLinks = (links: HostMetaLink[]): string[] =>
  links.flatMap((link) => {
    const props = Object.entries(link)
      .filter(([key, value]) =>
        !(['titles', 'properties'].includes(key) || value === undefined)
      )
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ')

    if (!link.properties && !link.titles) {
      return `  <Link ${props} />`
    } else {
      return [
        `  <Link ${props}>`,
        ...(link.titles ? stringifyTitles(link.titles) : []),
        ...(link.properties ? stringifyProperties(link.properties, 4) : []),
        '  </Link>',
      ]
    }
  })

export const stringify = (hostMeta: HostMeta): string => {
  const result = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">',
  ]

  if (hostMeta.subject) {
    result.push(`  <Subject>${hostMeta.subject}</Subject>`)
  }

  if (hostMeta.expires) {
    result.push(`  <Expires>${hostMeta.expires}</Expires>`)
  }

  hostMeta.aliases?.forEach((alias) => result.push(`  <Alias>${alias}</Alias>`))

  if (hostMeta.properties) {
    result.push(...stringifyProperties(hostMeta.properties))
  }

  if (hostMeta.links) {
    result.push(...stringifyLinks(hostMeta.links))
  }

  result.push('</XRD>')

  return result.join('\n')
}
