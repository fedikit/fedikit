import { assertEquals } from 'std/assert/mod.ts'

import * as mod from '../../src/webfinger/mod.ts'

Deno.test('exports', () => {
  assertEquals(!!mod, true)
})
