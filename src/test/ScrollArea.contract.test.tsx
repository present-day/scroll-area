import { fireEvent, render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { ScrollArea as BaseUIScrollArea } from '../base-ui'
import { ScrollArea as RadixScrollArea } from '../radix'
import { nextFrame, stubMetrics } from './utils'

/** Both adapters promise the same props and DOM contract. */
const adapters = [
  ['radix', RadixScrollArea],
  ['base-ui', BaseUIScrollArea],
] as const

const overflowing = { scrollHeight: 300, clientHeight: 100, scrollTop: 50 }

describe.each(adapters)('%s ScrollArea', (_name, ScrollArea) => {
  it('defaults to the fade effect with no shadow overlay', () => {
    render(<ScrollArea data-testid="root">content</ScrollArea>)
    const root = screen.getByTestId('root')
    expect(root).toHaveClass('sa-root')
    expect(root).toHaveAttribute('data-edge-effect', 'fade')
    expect(root.querySelector('.sa-edge-shadow')).toBeNull()
  })

  it('renders a hidden overlay for the shadow effect', () => {
    render(
      <ScrollArea data-testid="root" edgeEffect="shadow">
        content
      </ScrollArea>,
    )
    const overlay = screen.getByTestId('root').querySelector('.sa-edge-shadow')
    expect(overlay).toHaveAttribute('aria-hidden', 'true')
  })

  it('turns a numeric edgeSize into pixels', () => {
    render(
      <ScrollArea data-testid="root" edgeSize={40}>
        content
      </ScrollArea>,
    )
    expect(
      screen
        .getByTestId('root')
        .style.getPropertyValue('--scroll-area-edge-size'),
    ).toBe('40px')
  })

  it('passes CSS lengths through', () => {
    render(
      <ScrollArea data-testid="root" edgeSize="2rem">
        content
      </ScrollArea>,
    )
    expect(
      screen
        .getByTestId('root')
        .style.getPropertyValue('--scroll-area-edge-size'),
    ).toBe('2rem')
  })

  it('forwards its ref to the root', () => {
    const ref = createRef<HTMLDivElement>()
    render(
      <ScrollArea ref={ref} data-testid="root">
        content
      </ScrollArea>,
    )
    expect(ref.current).toBe(screen.getByTestId('root'))
  })

  it('shares the viewport with an external ref and still tracks edges', async () => {
    const viewportRef = createRef<HTMLDivElement>()
    render(
      <ScrollArea data-testid="root" viewportRef={viewportRef}>
        content
      </ScrollArea>,
    )
    const viewport = viewportRef.current as HTMLDivElement
    expect(viewport).toHaveClass('sa-viewport')

    stubMetrics(viewport, overflowing)
    fireEvent.scroll(viewport)
    await nextFrame()

    const root = screen.getByTestId('root')
    expect(root).toHaveAttribute('data-overflow-top')
    expect(root).toHaveAttribute('data-overflow-bottom')
  })

  it('accepts a callback viewportRef', () => {
    const viewportRef = vi.fn()
    render(<ScrollArea viewportRef={viewportRef}>content</ScrollArea>)
    expect(viewportRef).toHaveBeenCalledWith(expect.any(HTMLDivElement))
  })

  it('calls onScroll', () => {
    const onScroll = vi.fn()
    const viewportRef = createRef<HTMLDivElement>()
    render(
      <ScrollArea viewportRef={viewportRef} onScroll={onScroll}>
        content
      </ScrollArea>,
    )
    fireEvent.scroll(viewportRef.current as HTMLDivElement)
    expect(onScroll).toHaveBeenCalledTimes(1)
  })

  it('does not re-render children while scrolling', async () => {
    let renders = 0
    function Child() {
      renders++
      return <p>content</p>
    }
    const viewportRef = createRef<HTMLDivElement>()
    render(
      <ScrollArea viewportRef={viewportRef}>
        <Child />
      </ScrollArea>,
    )
    const before = renders
    const viewport = viewportRef.current as HTMLDivElement

    for (const scrollTop of [10, 50, 120]) {
      stubMetrics(viewport, { ...overflowing, scrollTop })
      fireEvent.scroll(viewport)
    }
    await nextFrame()

    expect(renders).toBe(before)
  })

  it('applies the reading direction', () => {
    const viewportRef = createRef<HTMLDivElement>()
    render(
      <ScrollArea dir="rtl" viewportRef={viewportRef} axis="horizontal">
        content
      </ScrollArea>,
    )
    // happy-dom doesn't derive `direction` from `dir`; browsers do.
    expect(viewportRef.current?.closest('[dir]')).toHaveAttribute('dir', 'rtl')
  })

  it('keeps the viewport scrollable with hidden scrollbars', () => {
    const viewportRef = createRef<HTMLDivElement>()
    render(
      <ScrollArea
        data-testid="root"
        scrollbars="hidden"
        viewportRef={viewportRef}
      >
        content
      </ScrollArea>,
    )
    expect(screen.getByTestId('root')).toHaveAttribute(
      'data-scrollbars',
      'hidden',
    )
    const { overflow, overflowY } = (viewportRef.current as HTMLDivElement)
      .style
    expect(overflowY || overflow).toBe('scroll')
  })
})
