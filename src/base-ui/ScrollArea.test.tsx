import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { Root } from './parts'
import { ScrollArea } from './ScrollArea'

describe('Base UI ScrollArea', () => {
  it('wraps children in a classed Content part', () => {
    render(
      <ScrollArea classNames={{ content: 'custom' }}>
        <p>child</p>
      </ScrollArea>,
    )
    const content = screen.getByText('child').parentElement
    expect(content).toHaveClass('sa-content', 'custom')
    expect(content?.parentElement).toHaveClass('sa-viewport')
  })

  it('exposes scrollbar visibility for CSS', () => {
    render(
      <ScrollArea data-testid="root" scrollbars="scroll">
        content
      </ScrollArea>,
    )
    expect(screen.getByTestId('root')).toHaveAttribute(
      'data-scrollbars',
      'scroll',
    )
  })

  it('keeps scrollbars mounted without overflow when scrollbars="always"', () => {
    render(
      <ScrollArea data-testid="root" scrollbars="always" axis="both">
        content
      </ScrollArea>,
    )
    const bars = screen
      .getByTestId('root')
      .querySelectorAll('.sa-scrollbar[data-orientation]')
    expect(bars).toHaveLength(2)
  })

  it('unmounts scrollbars without overflow when scrollbars="auto"', () => {
    render(
      <ScrollArea data-testid="root" scrollbars="auto">
        content
      </ScrollArea>,
    )
    expect(screen.getByTestId('root').querySelector('.sa-scrollbar')).toBeNull()
  })

  it('merges root classes with the base class', () => {
    render(
      <ScrollArea
        data-testid="root"
        classNames={{ root: 'custom-root' }}
        className="outer"
      >
        content
      </ScrollArea>,
    )
    expect(screen.getByTestId('root')).toHaveClass(
      'sa-root',
      'outer',
      'custom-root',
    )
  })

  it('keeps the base class when a part gets a state callback', () => {
    render(
      <Root
        data-testid="root"
        className={(state) => (state.scrolling ? 'busy' : 'idle')}
      />,
    )
    expect(screen.getByTestId('root')).toHaveClass('sa-root', 'idle')
  })
})
