type Metric =
  | 'scrollTop'
  | 'scrollLeft'
  | 'scrollHeight'
  | 'scrollWidth'
  | 'clientHeight'
  | 'clientWidth'

/** happy-dom has no layout, so tests set scroll geometry by hand. */
export function stubMetrics(
  el: HTMLElement,
  metrics: Partial<Record<Metric, number>>,
) {
  for (const [key, value] of Object.entries(metrics)) {
    Object.defineProperty(el, key, {
      configurable: true,
      writable: true,
      value,
    })
  }
}

export const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
