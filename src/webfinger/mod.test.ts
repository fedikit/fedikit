import { assertEquals } from '../deps/std/assert.ts'

import * as mod from './mod.ts'

Deno.test('exports', () => {
  assertEquals(!!mod, true)
})
