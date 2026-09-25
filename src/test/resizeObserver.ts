export const resizeObservers = new Set<MockResizeObserver>()

export class MockResizeObserver {
  readonly targets = new Set<Element>()

  constructor(private readonly callback: ResizeObserverCallback) {
    resizeObservers.add(this)
  }

  observe(target: Element) {
    this.targets.add(target)
  }

  unobserve(target: Element) {
    this.targets.delete(target)
  }

  disconnect() {
    this.targets.clear()
    resizeObservers.delete(this)
  }

  /** Simulates a size change on the observed elements. */
  trigger() {
    this.callback([], this as unknown as ResizeObserver)
  }
}
