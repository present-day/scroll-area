import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'base-ui': 'src/base-ui/index.ts',
    styles: 'src/core/styles.css',
  },
  format: ['cjs', 'esm'],
  // Types for the JS entries only; the stylesheet entry has none.
  dts: { entry: { index: 'src/index.ts', 'base-ui': 'src/base-ui/index.ts' } },
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    '@radix-ui/react-scroll-area',
    /^@base-ui\/react/,
  ],
  // The stylesheet is its own entry; link it from every JS file so app
  // bundlers load it with either adapter. The components are client-only.
  banner: ({ format }) =>
    format === 'esm'
      ? { js: '"use client";\nimport "./styles.css";' }
      : { js: '"use client";\nrequire("./styles.css");' },
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})
