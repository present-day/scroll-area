import { createContext, forwardRef, useContext } from 'react'
import type { ScrollAreaSharedProps } from '../src'
import { ScrollArea as RadixScrollArea } from '../src'
import { ScrollArea as BaseUIScrollArea } from '../src/base-ui'

/** The primitive library a story renders with, picked in the toolbar. */
export const ADAPTER = {
  RADIX: 'radix',
  BASE_UI: 'base-ui',
} as const
export type Adapter = (typeof ADAPTER)[keyof typeof ADAPTER]

const components = {
  [ADAPTER.RADIX]: RadixScrollArea,
  [ADAPTER.BASE_UI]: BaseUIScrollArea,
} satisfies Record<Adapter, unknown>

export const AdapterContext = createContext<Adapter>(ADAPTER.RADIX)

/** Renders the adapter picked in the toolbar; both take the same props. */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaSharedProps>(
  function ScrollArea(props, ref) {
    const Component = components[useContext(AdapterContext)]
    return <Component ref={ref} {...props} />
  },
)
