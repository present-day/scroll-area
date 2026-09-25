import type { CSSProperties, ReactNode, Ref, UIEventHandler } from 'react'

import type { ScrollAxes } from './useScrollEdges'

/*
 * Each option set is an `as const` object in SCREAMING_SNAKE_CASE plus a
 * PascalCase union type derived from it, so `axis={SCROLL_AREA_AXIS.BOTH}` and
 * `axis="both"` are equivalent.
 */

/** Which directions scroll. */
export const SCROLL_AREA_AXIS = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
  BOTH: 'both',
} as const
export type ScrollAreaAxis =
  (typeof SCROLL_AREA_AXIS)[keyof typeof SCROLL_AREA_AXIS]

/** How edges with more content beyond them are signaled. */
export const SCROLL_AREA_EDGE_EFFECT = {
  /** Fades the content itself toward the edge (color-independent). */
  FADE: 'fade',
  /** Draws `--scroll-area-shadow-color` over the edge. */
  SHADOW: 'shadow',
  /** Draws nothing; `data-overflow-*` attributes are still set. */
  NONE: 'none',
} as const
export type ScrollAreaEdgeEffect =
  (typeof SCROLL_AREA_EDGE_EFFECT)[keyof typeof SCROLL_AREA_EDGE_EFFECT]

/** When scrollbars are visible. */
export const SCROLL_AREA_SCROLLBARS = {
  /** While scrolling or hovering the area. */
  HOVER: 'hover',
  /** While scrolling. */
  SCROLL: 'scroll',
  /** While the content overflows. */
  AUTO: 'auto',
  /** Even when the content doesn't overflow. */
  ALWAYS: 'always',
  /** Never; the area still scrolls by wheel, touch, and keyboard. */
  HIDDEN: 'hidden',
} as const
export type ScrollAreaScrollbars =
  (typeof SCROLL_AREA_SCROLLBARS)[keyof typeof SCROLL_AREA_SCROLLBARS]

export type ScrollAreaClassNames = {
  root?: string
  viewport?: string
  scrollbar?: string
  thumb?: string
}

/** Props every adapter's `ScrollArea` accepts, with the same meaning. */
export interface ScrollAreaSharedProps {
  children?: ReactNode
  /** Which directions scroll. Defaults to `"vertical"`. */
  axis?: ScrollAreaAxis
  /** How edges with more content beyond them are signaled. Defaults to `"fade"`. */
  edgeEffect?: ScrollAreaEdgeEffect
  /** Depth of the edge effect: a number of pixels or any CSS length. */
  edgeSize?: number | string
  /** When scrollbars are visible. Defaults to `"hover"`. */
  scrollbars?: ScrollAreaScrollbars
  /** Reading direction; flips horizontal scrolling and the scrollbar side. */
  dir?: 'ltr' | 'rtl'
  className?: string
  style?: CSSProperties
  /** Classes for the internal parts. */
  classNames?: ScrollAreaClassNames
  /** Ref to the scrolling viewport element. */
  viewportRef?: Ref<HTMLDivElement>
  onScroll?: UIEventHandler<HTMLDivElement>
}

type StyleWithVars = CSSProperties & Record<`--${string}`, string>

export function axesFor(axis: ScrollAreaAxis): ScrollAxes {
  return {
    horizontal: axis !== 'vertical',
    vertical: axis !== 'horizontal',
  }
}

/** The root's inline style, with `edgeSize` applied as the size token. */
export function rootStyle(
  style: CSSProperties | undefined,
  edgeSize: number | string | undefined,
): StyleWithVars {
  const result: StyleWithVars = { ...style }
  if (edgeSize !== undefined) {
    result['--scroll-area-edge-size'] =
      typeof edgeSize === 'number' ? `${edgeSize}px` : edgeSize
  }
  return result
}
