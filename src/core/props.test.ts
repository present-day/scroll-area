import { describe, expect, it } from 'vitest'

import {
  SCROLL_AREA_AXIS,
  SCROLL_AREA_EDGE_EFFECT,
  SCROLL_AREA_SCROLLBARS,
} from './props'

describe('option objects', () => {
  it('use uppercase keys', () => {
    expect(SCROLL_AREA_EDGE_EFFECT.SHADOW).toBe('shadow')
    expect(SCROLL_AREA_SCROLLBARS.HIDDEN).toBe('hidden')
  })

  it('list every allowed value', () => {
    expect(Object.values(SCROLL_AREA_AXIS)).toEqual([
      'vertical',
      'horizontal',
      'both',
    ])
    expect(Object.values(SCROLL_AREA_EDGE_EFFECT)).toEqual([
      'fade',
      'shadow',
      'none',
    ])
    expect(Object.values(SCROLL_AREA_SCROLLBARS)).toEqual([
      'hover',
      'scroll',
      'auto',
      'always',
      'hidden',
    ])
  })
})
