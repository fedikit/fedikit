// /** {@link https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-message-signatures-19#section-2.2} */
// export type Components =
//   | '@method'
//   | '@target-uri'
//   | '@authority'
//   | '@scheme'
//   | '@request-target'
//   | '@path'
//   | '@query'
//   | '@query-param'
//   | '@status'
//   // deno-lint-ignore ban-types
//   | (string & {})

// /** {@link https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-message-signatures-19#section-2.3} */
// export type Parameter =
//   | 'created'
//   | 'expires'
//   | 'nonce'
//   | 'alg'
//   | 'keyid'
//   // deno-lint-ignore ban-types
//   | (string & {})

// /** {@link https://datatracker.ietf.org/doc/html/draft-cavage-http-signatures-12#section-4.1.1} */
// export type Signature = {
//   keyId: string
//   algorithm: string
//   created?: number
//   expires?: number
//   headers: string[]
//   signature: string
// }

// /** {@link https://datatracker.ietf.org/doc/html/draft-cavage-http-signatures-12#section-4.1.1} */
// export type ParsedSignature = {
//   keyId: string
//   algorithm: string
//   created?: number
//   expires?: number
//   headers: string[]
//   signature: string
// }
