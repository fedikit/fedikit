import { assertEquals } from 'std/assert/mod.ts'

import * as mod from './mod.ts'

Deno.test('exports', () => {
  assertEquals(!!mod, true)
})
