import type { Decorator, Preview } from '@storybook/react-vite'

import '../src/core/styles.css'
import './preview.css'

import { ADAPTER, type Adapter, AdapterContext } from '../stories/adapter'

type Theme = 'light' | 'dark' | 'system'

/** Sets `color-scheme` the same way a host app would, and picks the adapter. */
const withTheme: Decorator = (Story, context) => {
  const theme = (context.globals.theme ?? 'system') as Theme
  const adapter = (context.globals.adapter ?? ADAPTER.RADIX) as Adapter
  return (
    <AdapterContext.Provider value={adapter}>
      <div
        className="sb-surface"
        style={{ colorScheme: theme === 'system' ? 'light dark' : theme }}
      >
        <Story />
      </div>
    </AdapterContext.Provider>
  )
}

const preview: Preview = {
  globalTypes: {
    adapter: {
      description: 'Primitive library',
      toolbar: {
        title: 'Adapter',
        icon: 'component',
        items: [
          { value: ADAPTER.RADIX, title: 'Radix' },
          { value: ADAPTER.BASE_UI, title: 'Base UI' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: 'Color scheme',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'system', title: 'System', icon: 'browser' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'system', adapter: ADAPTER.RADIX },
  decorators: [withTheme],
  parameters: { layout: 'fullscreen' },
}

export default preview
