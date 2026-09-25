import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

import { MockResizeObserver, resizeObservers } from './resizeObserver'

globalThis.ResizeObserver =
  MockResizeObserver as unknown as typeof ResizeObserver

afterEach(() => {
  cleanup()
  resizeObservers.clear()
})
