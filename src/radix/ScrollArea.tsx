import type * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import clsx from 'clsx'
import * as React from 'react'

import { mergeRefs } from '../core/mergeRefs'
import { axesFor, rootStyle, type ScrollAreaSharedProps } from '../core/props'
import { useScrollEdges } from '../core/useScrollEdges'
import { Corner, Root, Scrollbar, Thumb, Viewport } from './parts'

export interface ScrollAreaProps
  extends ScrollAreaSharedProps,
    Omit<
      ScrollAreaPrimitive.ScrollAreaProps,
      keyof ScrollAreaSharedProps | 'type'
    > {}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea(
    {
      children,
      axis = 'vertical',
      edgeEffect = 'fade',
      edgeSize,
      scrollbars = 'hover',
      classNames = {},
      className,
      style,
      viewportRef,
      onScroll,
      ...rootProps
    },
    ref,
  ) {
    const rootRef = React.useRef<HTMLDivElement>(null)
    const { horizontal, vertical } = axesFor(axis)
    const edgesRef = useScrollEdges<HTMLDivElement>(rootRef, {
      horizontal,
      vertical,
    })
    // Memoized so React doesn't detach and reattach the refs on every render.
    const mergedRootRef = React.useMemo(() => mergeRefs(ref, rootRef), [ref])
    const mergedViewportRef = React.useMemo(
      () => mergeRefs(viewportRef, edgesRef),
      [viewportRef, edgesRef],
    )

    return (
      <Root
        {...rootProps}
        ref={mergedRootRef}
        // Radix only lets the viewport scroll while a scrollbar is mounted, so
        // "hidden" keeps them mounted and the stylesheet hides them.
        type={scrollbars === 'hidden' ? 'scroll' : scrollbars}
        data-edge-effect={edgeEffect}
        data-scrollbars={scrollbars}
        className={clsx(className, classNames.root)}
        style={rootStyle(style, edgeSize)}
      >
        <Viewport
          ref={mergedViewportRef}
          className={classNames.viewport}
          onScroll={onScroll}
        >
          {children}
        </Viewport>
        {edgeEffect === 'shadow' ? (
          <div className="sa-edge-shadow" aria-hidden="true" />
        ) : null}
        {vertical ? (
          <Scrollbar orientation="vertical" className={classNames.scrollbar}>
            <Thumb className={classNames.thumb} />
          </Scrollbar>
        ) : null}
        {horizontal ? (
          <Scrollbar orientation="horizontal" className={classNames.scrollbar}>
            <Thumb className={classNames.thumb} />
          </Scrollbar>
        ) : null}
        {vertical && horizontal ? <Corner /> : null}
      </Root>
    )
  },
)
