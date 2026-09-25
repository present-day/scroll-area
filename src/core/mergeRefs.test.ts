import { createRef } from 'react'
import { describe, expect, it, vi } from 'vitest'

import { mergeRefs } from './mergeRefs'

describe('mergeRefs', () => {
  it('assigns object refs and calls callback refs', () => {
    const objectRef = createRef<HTMLDivElement>()
    const callbackRef = vi.fn()
    const node = document.createElement('div')

    mergeRefs(objectRef, callbackRef)(node)

    expect(objectRef.current).toBe(node)
    expect(callbackRef).toHaveBeenCalledWith(node)
  })

  it('skips undefined and null refs', () => {
    const objectRef = createRef<HTMLDivElement>()
    expect(() =>
      mergeRefs(undefined, null, objectRef)(document.createElement('div')),
    ).not.toThrow()
  })

  it('clears refs on detach', () => {
    const objectRef = createRef<HTMLDivElement>()
    const merged = mergeRefs(objectRef)
    merged(document.createElement('div'))
    merged(null)
    expect(objectRef.current).toBeNull()
  })
})
