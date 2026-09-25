import type { CSSProperties, ReactNode } from 'react'

import './demo.css'

export type DemoContent = 'list' | 'chips' | 'grid' | 'prose'
export type DemoSurface = 'plain' | 'card' | 'tinted'

const NAMES = [
  'Ada Lovelace',
  'Grace Hopper',
  'Katherine Johnson',
  'Alan Turing',
  'Margaret Hamilton',
  'Edsger Dijkstra',
  'Barbara Liskov',
  'Donald Knuth',
]

const TAGS = [
  'Design',
  'Engineering',
  'Research',
  'Accessibility',
  'Motion',
  'Typography',
  'Color',
  'Layout',
  'Performance',
  'Testing',
  'Documentation',
  'Tooling',
  'Security',
  'Localization',
  'Analytics',
  'Infrastructure',
]

export function DemoList({ count = 40 }: { count?: number }) {
  return (
    <ul className="demo-list">
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static demo rows
        <li key={i}>
          <span
            className="demo-avatar"
            style={{ '--hue': (i * 47) % 360 } as CSSProperties}
          />
          <span>
            <strong>{NAMES[i % NAMES.length]}</strong>
            <small>Updated {i + 1} min ago</small>
          </span>
        </li>
      ))}
    </ul>
  )
}

function DemoChips() {
  return (
    <div className="demo-chips">
      {TAGS.map((tag) => (
        <span key={tag} className="demo-chip">
          {tag}
        </span>
      ))}
    </div>
  )
}

function DemoGrid() {
  return (
    <div className="demo-grid">
      {Array.from({ length: 16 * 24 }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static demo cells
        <span key={i}>
          {String.fromCharCode(65 + (i % 16))}
          {Math.floor(i / 16) + 1}
        </span>
      ))}
    </div>
  )
}

function DemoProse() {
  return (
    <div className="demo-prose">
      {Array.from({ length: 8 }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static paragraphs
        <p key={i}>
          The edge treatment tells people there is more to see without taking
          space away from the content. A fade works on any background because it
          only changes opacity; a shadow adds a tint that follows the color
          scheme through a single token.
        </p>
      ))}
    </div>
  )
}

export function DemoContentView({ content }: { content: DemoContent }) {
  switch (content) {
    case 'chips':
      return <DemoChips />
    case 'grid':
      return <DemoGrid />
    case 'prose':
      return <DemoProse />
    default:
      return <DemoList />
  }
}

export function Frame({
  surface,
  width,
  height,
  children,
}: {
  surface: DemoSurface
  width: number
  height: number
  children: ReactNode
}) {
  return (
    <div
      className={`demo-frame demo-frame--${surface}`}
      style={{ inlineSize: width, blockSize: height }}
    >
      {children}
    </div>
  )
}
