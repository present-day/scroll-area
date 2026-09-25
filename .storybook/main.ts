import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  viteFinal: (viteConfig) =>
    mergeConfig(viteConfig, {
      build: {
        // Vite's default targets predate light-dark(), so Lightning CSS
        // rewrites it into a var() polyfill that only works when color-scheme
        // is declared in CSS. The stories set it from JavaScript, and the
        // package's whole point is native light-dark(), so target browsers
        // that support it and ship the CSS unchanged.
        cssTarget: ['chrome123', 'edge123', 'firefox120', 'safari17.5'],
      },
    }),
}

export default config
