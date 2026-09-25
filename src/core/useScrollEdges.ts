import { type RefObject, useLayoutEffect, useState } from 'react'

export type ScrollAxes = { horizontal: boolean; vertical: boolean }
export type EdgeSide = 'top' | 'right' | 'bottom' | 'left'
export type Edges = Record<EdgeSide, boolean>

export const EDGE_SIDES: readonly EdgeSide[] = [
  'top',
  'right',
  'bottom',
  'left',
]

/** Absorbs fractional scroll positions from zoom and high-DPI displays. */
const TOLERANCE = 1

/** Which physical edges of `el` have more content beyond them. */
export function measureEdges(el: HTMLElement, axes: ScrollAxes): Edges {
  const { scrollTop, scrollHeight, clientHeight, scrollWidth, clientWidth } = el
  const maxLeft = scrollWidth - clientWidth
  // In RTL, scrollLeft is 0 at the right edge and goes negative toward the left.
  const rtl = getComputedStyle(el).direction === 'rtl'
  const fromLeft = rtl ? maxLeft + el.scrollLeft : el.scrollLeft

  return {
    top: axes.vertical && scrollTop > TOLERANCE,
    right: axes.horizontal && maxLeft - fromLeft > TOLERANCE,
    bottom:
      axes.vertical && scrollHeight - clientHeight - scrollTop > TOLERANCE,
    left: axes.horizontal && fromLeft > TOLERANCE,
  }
}

/**
 * Tracks which edges of a scrolling element have hidden content and mirrors
 * them as `data-overflow-{side}` attributes on `targetRef`. Writes go straight
 * to the DOM, so scrolling never re-renders React.
 *
 * Returns a callback ref for the scrolling element.
 */
export function useScrollEdges<T extends HTMLElement = HTMLDivElement>(
  targetRef: RefObject<HTMLElement | null>,
  { horizontal, vertical }: ScrollAxes,
): (node: T | null) => void {
  const [viewport, setViewport] = useState<T | null>(null)

  useLayoutEffect(() => {
    if (!viewport) return

    let frame = 0
    const apply = () => {
      frame = 0
      const target = targetRef.current
      if (!target) return
      const edges = measureEdges(viewport, { horizontal, vertical })
      for (const side of EDGE_SIDES) {
        target.toggleAttribute(`data-overflow-${side}`, edges[side])
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }

    apply()
    viewport.addEventListener('scroll', schedule, { passive: true })
    const observer = new ResizeObserver(schedule)
    observer.observe(viewport)
    if (viewport.firstElementChild) observer.observe(viewport.firstElementChild)

    return () => {
      cancelAnimationFrame(frame)
      viewport.removeEventListener('scroll', schedule)
      observer.disconnect()
    }
  }, [viewport, targetRef, horizontal, vertical])

  return setViewport
}
