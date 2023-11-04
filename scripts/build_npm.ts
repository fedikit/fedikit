import { build, emptyDir } from 'https://deno.land/x/dnt@0.38.1/mod.ts'

await Deno.remove('./npm', { recursive: true })
await emptyDir('./npm')

const encoder = new TextEncoder()

await Deno.writeFile(
  './npm/pnpm-workspace.yaml',
  encoder.encode(`packages:\n  - ./*`),
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

await emptyDir('./npm/http-signature')

await build({
  importMap: 'import_map.json',
  entryPoints: ['./src/http-signature/mod.ts'],
  outDir: './npm/http-signature',
  shims: { deno: true },
  declaration: 'separate',
  esModule: true,
  scriptModule: false,
  skipSourceOutput: true,
  compilerOptions: {
    lib: ['ESNext', 'DOM', 'DOM.Iterable'],
  },
  // if enable, test only
  test: false,
  package: {
    name: '@fedikit/http-signature',
    version: Deno.args[0],
    engines: { node: '>=20.0.0' },
    devDependencies: {
      '@types/node': '^20.0.0',
    },
  },
  // skip install
  // packageManager: 'pnpm',
  packageManager: 'echo',
  postBuild: () => {
    Deno.copyFileSync(
      './src/http-signature/README.md',
      './npm/http-signature/README.md',
    )
  },
})
