#!/usr/bin/env -S deno run

import { generateKey, exportPrivateKey, exportPublicKey } from '../src/http-signature/lib/key.ts'

const keyPair = await generateKey({
  modulusLength: [2048, 3072, 4096].some(length => +Deno.args[0] === length)
    ? +Deno.args[0] as 2048 | 3072 | 4096
    : 4096
})

console.log(`%c${await exportPrivateKey(keyPair)}`, 'color: red')
console.log(`%c${await exportPublicKey(keyPair)}`, 'color: green')
