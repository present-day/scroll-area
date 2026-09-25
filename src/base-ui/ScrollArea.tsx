import { DirectionProvider } from '@base-ui/react/direction-provider'
import type { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area'
import clsx from 'clsx'
import * as React from 'react'

import { mergeRefs } from '../core/mergeRefs'
import {
  axesFor,
  rootStyle,
  type ScrollAreaClassNames,
  type ScrollAreaSharedProps,
} from '../core/props'
import { useScrollEdges } from '../core/useScrollEdges'
import { Content, Corner, Root, Scrollbar, Thumb, Viewport } from './parts'

export type BaseUIScrollAreaClassNames = ScrollAreaClassNames & {
  /** The Content part that wraps `children` inside the viewport. */
  content?: string
}

export interface ScrollAreaProps
  extends Omit<ScrollAreaSharedProps, 'classNames'>,
    Omit<ScrollAreaPrimitive.Root.Props, keyof ScrollAreaSharedProps> {
  classNames?: BaseUIScrollAreaClassNames
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  function ScrollArea(
    {
      children,
      axis = 'vertical',
      edgeEffect = 'fade',
      edgeSize,
      scrollbars = 'hover',
      dir,
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
    // Base UI sets its own logical `data-overflow-x-start` etc. The shared hook
    // adds the physical `data-overflow-*` attributes the stylesheet keys off.
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

    // Base UI mounts scrollbars only while content overflows ("auto"), and
    // exposes hover/scroll state that the stylesheet uses for the other modes.
    const keepMounted = scrollbars === 'always'

    const area = (
      <Root
        {...rootProps}
        ref={mergedRootRef}
        dir={dir}
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
          <Content className={classNames.content}>{children}</Content>
        </Viewport>
        {edgeEffect === 'shadow' ? (
          <div className="sa-edge-shadow" aria-hidden="true" />
        ) : null}
        {vertical ? (
          <Scrollbar
            orientation="vertical"
            keepMounted={keepMounted}
            className={classNames.scrollbar}
          >
            <Thumb className={classNames.thumb} />
          </Scrollbar>
        ) : null}
        {horizontal ? (
          <Scrollbar
            orientation="horizontal"
            keepMounted={keepMounted}
            className={classNames.scrollbar}
          >
            <Thumb className={classNames.thumb} />
          </Scrollbar>
        ) : null}
        {vertical && horizontal ? <Corner /> : null}
      </Root>
    )

    // Base UI reads direction from context, not the `dir` attribute. Only
    // provide it when set, so an app-level DirectionProvider still applies.
    return dir ? (
      <DirectionProvider direction={dir}>{area}</DirectionProvider>
    ) : (
      area
    )
  },
)
