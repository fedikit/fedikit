# FediKit

[![deno.land/x/fedikit](https://shield.deno.dev/x/fedikit)](https://deno.land/x/fedikit)
![deno compatibility](https://shield.deno.dev/deno/^1.38)
[![npm](https://img.shields.io/npm/v/%40fedikit/http-signature)](https://www.npmjs.com/org/fedikit)

Building Blocks for Fediverse.

## Features

- Available on multiple runtimes.
  - FediKit is a Deno modules, published to npm with the help of [`dnt`](https://github.com/denoland/dnt).
- Focus on [Web Standard](https://hono.dev/concepts/web-standard).
  - FediKit uses Web Standard APIs for functionality such as `fetch`, `Request` and `Response` wherever possible.
  - For HTTP Signature, it uses the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).

## Setup

### Deno

Add FediKit to your `deno.json` or `import_map.json` (replace `{{version}}` with
the [current version](https://github.com/fedikit/fedikit/tags)):

```json
{
  "imports": {
    "fedikit/": "https://deno.land/x/fedikit@{{version}}/"
  }
}
```

### Node.js / Bun

FediKit is published under the [`@fedikit`](https://www.npmjs.com/org/fedikit)
scope of npm, and you can download a package individually to suit your needs.

```bash
bun add @fedikit/http-signature # bun
pnpm add @fedikit/http-signature # pnpm
yarn add @fedikit/http-signature # yarn
npm i @fedikit/http-signature # npm
```

## Blocks

### [HostMeta](/src/host-meta/)

### [HTTP Signature](/src/http-signature/) [WIP]

### [NodeInfo](/src/nodeinfo/)

### [Webfinger](/src/webfinger/)

## Roadmap

FediKit currently only has a few peripheral libraries, mostly because of my
limited energy.

I might consider writing some ActivityPub libraries (e.g. Actor, Activity
Queues) once this project have other contributors on board.

## License

Licensed under [MIT](LICENSE.md).

### Third Party Licenses

This project partially copies code from the following projects:

- [yusukebe/minidon](https://github.com/yusukebe/minidon)
  ([MIT](https://github.com/yusukebe/minidon#license))
- [skymethod/minipub](https://github.com/skymethod/minipub)
  ([MIT](https://github.com/skymethod/minipub/blob/master/LICENSE))
