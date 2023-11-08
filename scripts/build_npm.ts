#!/usr/bin/env -S deno run -A

import {
  build,
  type BuildOptions,
  emptyDir,
} from 'https://deno.land/x/dnt@0.38.1/mod.ts'

const generateBuildOptions = (
  { name, version }: { name: string; version: string },
): BuildOptions => ({
  importMap: 'import_map.json',
  entryPoints: [`./src/${name}/mod.ts`],
  outDir: `./npm/packages/${name}`,
  shims: { deno: true },
  declaration: 'separate',
  esModule: true,
  scriptModule: false,
  skipSourceOutput: true,
  compilerOptions: {
    lib: ['ESNext', 'DOM', 'DOM.Iterable'],
  },
  // if version === 'test', test only
  test: version === 'test',
  testPattern: `./src/${name}/**/*.test.ts`,
  package: {
    name: `@fedikit/${name}`,
    version: version === 'test' ? '0.0.0-test.0' : version,
    // if version === 'test', set private
    private: version === 'test',
    engines: { node: '>=20.0.0' },
    description: 'Building Blocks for Fediverse.',
    license: 'MIT',
    repository: {
      type: 'git',
      url: 'https://github.com/fedikit/fedikit.git',
      directory: `src/${name}`,
    },
    homepage: 'https://github.com/fedikit/fedikit#readme',
    bugs: 'https://github.com/fedikit/fedikit/issues',
    devDependencies: {
      '@types/node': '^20.0.0',
    },
  },
  // if version !== 'test', skip install
  packageManager: version === 'test' ? 'pnpm' : 'echo',
  postBuild: async () => {
    // copy README.md
    await Deno.copyFile(
      `./src/${name}/README.md`,
      `./npm/packages/${name}/README.md`,
    )
    // copy LICENSE.md
    await Deno.copyFile(
      './LICENSE.md',
      `./npm/packages/${name}/LICENSE.md`,
    )
    // TODO: tree shaking
    // https://github.com/denoland/dnt/issues/180
    // https://github.com/denoland/dnt/issues/258
    // Note: pnpm dlx knip@autofix --fix
    // (currently doesn't work)
    // https://github.com/webpro/knip/issues/63
  },
})

try {
  await Deno.remove('./npm', { recursive: true })
} catch (err) {
  if (!(err instanceof Deno.errors.NotFound)) {
    throw err
  }
}

await emptyDir('./npm/packages')

const encoder = new TextEncoder()

await Deno.writeFile(
  './npm/.npmrc',
  encoder.encode([
    // https://pnpm.io/npmrc#prefer-frozen-lockfile
    'prefer-frozen-lockfile=false',
    // https://docs.npmjs.com/generating-provenance-statements#using-third-party-package-publishing-tools
    'provenance=true'
  ].join('\n'))
)
await Deno.writeFile(
  './npm/pnpm-workspace.yaml',
  encoder.encode([
    'packages:',
    '  - packages/*'
  ].join('\n')),
)
await Deno.writeFile(
  './npm/package.json',
  encoder.encode(JSON.stringify(
    {
      name: '@fedikit/workspace',
      private: true,
      scripts: {},
    },
    null,
    2,
  )),
)
// await Deno.writeFile(
//   './npm/knip.json',
//   encoder.encode(JSON.stringify({
//     workspaces: {
//       './*': {
//         entry: 'esm/mod.js',
//         project: '**/*.{js,d.ts}'
//       }
//     }
//   }))
// )

for await (const entry of Deno.readDir('./src')) {
  if (entry.isDirectory) {
    await emptyDir(`./npm/packages/${entry.name}`)
    await build(
      generateBuildOptions({ name: entry.name, version: Deno.args[0] }),
    )
  }
}
