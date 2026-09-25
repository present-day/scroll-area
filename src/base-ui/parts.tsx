import { ScrollArea as ScrollAreaPrimitive } from '@base-ui/react/scroll-area'
import clsx from 'clsx'
import * as React from 'react'

type ClassName<State> =
  | string
  | ((state: State) => string | undefined)
  | undefined

/** Prepends a base class, preserving Base UI's state-callback form. */
function withBase<State>(base: string, className: ClassName<State>) {
  return typeof className === 'function'
    ? (state: State) => clsx(base, className(state))
    : clsx(base, className)
}

export const Root = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.Root.Props
>(function Root({ className, ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      data-primitive="base-ui"
      className={withBase('sa-root', className)}
      {...props}
    />
  )
})

export const Viewport = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.Viewport.Props
>(function Viewport({ className, ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Viewport
      ref={ref}
      className={withBase('sa-viewport', className)}
      {...props}
    />
  )
})

export const Content = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.Content.Props
>(function Content({ className, ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Content
      ref={ref}
      className={withBase('sa-content', className)}
      {...props}
    />
  )
})

export const Scrollbar = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.Scrollbar.Props
>(function Scrollbar({ className, ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      ref={ref}
      className={withBase('sa-scrollbar', className)}
      {...props}
    />
  )
})

export const Thumb = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.Thumb.Props
>(function Thumb({ className, ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Thumb
      ref={ref}
      className={withBase('sa-thumb', className)}
      {...props}
    />
  )
})

export const Corner = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.Corner.Props
>(function Corner({ className, ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Corner
      ref={ref}
      className={withBase('sa-corner', className)}
      {...props}
    />
  )
})
