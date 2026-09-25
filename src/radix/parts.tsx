import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import clsx from 'clsx'
import * as React from 'react'

export const Root = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.ScrollAreaProps
>(function Root({ className, ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      data-primitive="radix"
      className={clsx('sa-root', className)}
      {...props}
    />
  )
})

export const Viewport = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.ScrollAreaViewportProps
>(function Viewport({ className, ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Viewport
      ref={ref}
      className={clsx('sa-viewport', className)}
      {...props}
    />
  )
})

export const Scrollbar = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.ScrollAreaScrollbarProps
>(function Scrollbar({ className, ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      ref={ref}
      className={clsx('sa-scrollbar', className)}
      {...props}
    />
  )
})

export const Thumb = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.ScrollAreaThumbProps
>(function Thumb({ className, ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Thumb
      ref={ref}
      className={clsx('sa-thumb', className)}
      {...props}
    />
  )
})

export const Corner = React.forwardRef<
  HTMLDivElement,
  ScrollAreaPrimitive.ScrollAreaCornerProps
>(function Corner({ className, ...props }, ref) {
  return (
    <ScrollAreaPrimitive.Corner
      ref={ref}
      className={clsx('sa-corner', className)}
      {...props}
    />
  )
})
