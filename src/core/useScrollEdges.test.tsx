import { render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { describe, expect, it } from 'vitest'

import { resizeObservers } from '../test/resizeObserver'
import { nextFrame, stubMetrics } from '../test/utils'
import { measureEdges, type ScrollAxes, useScrollEdges } from './useScrollEdges'

const both: ScrollAxes = { horizontal: true, vertical: true }
const scrollable = {
  scrollHeight: 300,
  clientHeight: 100,
  scrollWidth: 300,
  clientWidth: 100,
}

function element(metrics: Parameters<typeof stubMetrics>[1]) {
  const el = document.createElement('div')
  stubMetrics(el, { scrollTop: 0, scrollLeft: 0, ...metrics })
  return el
}

describe('measureEdges', () => {
  it('reports no edges when content fits', () => {
    const el = element({
      scrollHeight: 100,
      clientHeight: 100,
      scrollWidth: 100,
      clientWidth: 100,
    })
    expect(measureEdges(el, both)).toEqual({
      top: false,
      right: false,
      bottom: false,
      left: false,
    })
  })

  it('reports only the far edges at the start', () => {
    expect(measureEdges(element(scrollable), both)).toEqual({
      top: false,
      right: true,
      bottom: true,
      left: false,
    })
  })

  it('reports every edge mid-scroll', () => {
    const el = element({ ...scrollable, scrollTop: 100, scrollLeft: 100 })
    expect(measureEdges(el, both)).toEqual({
      top: true,
      right: true,
      bottom: true,
      left: true,
    })
  })

  it('reports only the near edges at the end', () => {
    const el = element({ ...scrollable, scrollTop: 200, scrollLeft: 200 })
    expect(measureEdges(el, both)).toEqual({
      top: true,
      right: false,
      bottom: false,
      left: true,
    })
  })

  it('tolerates sub-pixel end positions', () => {
    const el = element({ ...scrollable, scrollTop: 199.5 })
    expect(measureEdges(el, both).bottom).toBe(false)
  })

  it('ignores axes that are not enabled', () => {
    const el = element({ ...scrollable, scrollTop: 100, scrollLeft: 100 })
    expect(measureEdges(el, { horizontal: false, vertical: true })).toEqual({
      top: true,
      right: false,
      bottom: true,
      left: false,
    })
  })

  it('normalizes the negative scrollLeft used in RTL', () => {
    const el = element(scrollable)
    el.style.direction = 'rtl'
    // Computed direction only resolves for connected elements.
    document.body.append(el)
    // RTL starts at the right edge: scrollLeft 0.
    expect(measureEdges(el, both)).toMatchObject({ left: true, right: false })
    stubMetrics(el, { scrollLeft: -200 })
    expect(measureEdges(el, both)).toMatchObject({ left: false, right: true })
  })
})

function Harness({ axes }: { axes: ScrollAxes }) {
  const target = useRef<HTMLDivElement>(null)
  const viewportRef = useScrollEdges(target, axes)
  return (
    <div ref={target} data-testid="target">
      <div ref={viewportRef} data-testid="viewport">
        <div data-testid="content" />
      </div>
    </div>
  )
}

describe('useScrollEdges', () => {
  it('writes edge attributes to the target after a scroll', async () => {
    render(<Harness axes={both} />)
    const target = screen.getByTestId('target')
    const viewport = screen.getByTestId('viewport')

    stubMetrics(viewport, {
      scrollHeight: 300,
      clientHeight: 100,
      scrollWidth: 100,
      clientWidth: 100,
      scrollTop: 100,
    })
    viewport.dispatchEvent(new Event('scroll'))
    await nextFrame()

    expect(target).toHaveAttribute('data-overflow-top')
    expect(target).toHaveAttribute('data-overflow-bottom')
    expect(target).not.toHaveAttribute('data-overflow-left')
    expect(target).not.toHaveAttribute('data-overflow-right')
  })

  it('observes the viewport and its content', () => {
    render(<Harness axes={both} />)
    const observed = [...resizeObservers].flatMap((o) => [...o.targets])
    expect(observed).toContain(screen.getByTestId('viewport'))
    expect(observed).toContain(screen.getByTestId('content'))
  })

  it('re-measures when the observed size changes', async () => {
    render(<Harness axes={both} />)
    const target = screen.getByTestId('target')
    expect(target).not.toHaveAttribute('data-overflow-bottom')

    stubMetrics(screen.getByTestId('viewport'), {
      scrollHeight: 300,
      clientHeight: 100,
    })
    for (const observer of resizeObservers) observer.trigger()
    await nextFrame()

    expect(target).toHaveAttribute('data-overflow-bottom')
  })

  it('removes an attribute once its edge is reached', async () => {
    render(<Harness axes={both} />)
    const target = screen.getByTestId('target')
    const viewport = screen.getByTestId('viewport')

    stubMetrics(viewport, {
      scrollHeight: 300,
      clientHeight: 100,
      scrollTop: 0,
    })
    viewport.dispatchEvent(new Event('scroll'))
    await nextFrame()
    expect(target).toHaveAttribute('data-overflow-bottom')

    stubMetrics(viewport, { scrollTop: 200 })
    viewport.dispatchEvent(new Event('scroll'))
    await nextFrame()
    expect(target).not.toHaveAttribute('data-overflow-bottom')
  })
})
