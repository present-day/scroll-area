import type { Meta, StoryObj } from '@storybook/react-vite'
import { type CSSProperties, useRef, useState } from 'react'
import {
  ScrollArea as RadixScrollArea,
  SCROLL_AREA_AXIS,
  SCROLL_AREA_EDGE_EFFECT,
  SCROLL_AREA_SCROLLBARS,
  type ScrollAreaSharedProps,
} from '../src'
import { ScrollArea as BaseUIScrollArea } from '../src/base-ui'
import { ScrollArea } from './adapter'
import {
  DEMO_SURFACES,
  type DemoContent,
  DemoContentView,
  DemoList,
  type DemoSurface,
  Frame,
} from './demo'

type StoryArgs = Pick<
  ScrollAreaSharedProps,
  'axis' | 'edgeEffect' | 'edgeSize' | 'scrollbars' | 'dir'
> & {
  content: DemoContent
  surface: DemoSurface
  shadowColor: string
  width: number
  height: number
}

function shadowStyle(shadowColor: string) {
  return shadowColor
    ? ({ '--scroll-area-shadow-color': shadowColor } as CSSProperties)
    : undefined
}

const meta = {
  title: 'ScrollArea',
  args: {
    axis: SCROLL_AREA_AXIS.VERTICAL,
    edgeEffect: SCROLL_AREA_EDGE_EFFECT.FADE,
    edgeSize: 24,
    scrollbars: SCROLL_AREA_SCROLLBARS.HOVER,
    dir: 'ltr',
    content: 'list',
    surface: 'card',
    shadowColor: '',
    width: 320,
    height: 360,
  },
  argTypes: {
    axis: { control: 'inline-radio', options: Object.values(SCROLL_AREA_AXIS) },
    edgeEffect: {
      control: 'inline-radio',
      options: Object.values(SCROLL_AREA_EDGE_EFFECT),
    },
    edgeSize: { control: { type: 'range', min: 0, max: 96, step: 4 } },
    scrollbars: {
      control: 'select',
      options: Object.values(SCROLL_AREA_SCROLLBARS),
    },
    dir: { control: 'inline-radio', options: ['ltr', 'rtl'] },
    content: {
      control: 'select',
      options: ['list', 'chips', 'grid', 'prose'],
    },
    surface: { control: 'select', options: DEMO_SURFACES },
    shadowColor: {
      control: 'color',
      description: 'Overrides --scroll-area-shadow-color (edgeEffect="shadow")',
    },
    width: { control: { type: 'range', min: 160, max: 720, step: 8 } },
    height: { control: { type: 'range', min: 64, max: 640, step: 8 } },
  },
  render: ({ content, surface, shadowColor, width, height, ...props }) => (
    <Frame surface={surface} width={width} height={height}>
      <ScrollArea {...props} style={shadowStyle(shadowColor)}>
        <DemoContentView content={content} />
      </ScrollArea>
    </Frame>
  ),
} satisfies Meta<StoryArgs>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const VerticalList: Story = {}

export const HorizontalChips: Story = {
  args: {
    axis: 'horizontal',
    content: 'chips',
    width: 360,
    height: 64,
  },
}

export const HiddenScrollbars: Story = {
  name: 'Hidden scrollbars (edge effect only)',
  args: {
    axis: 'horizontal',
    content: 'chips',
    scrollbars: 'hidden',
    width: 360,
    height: 56,
  },
}

export const BothAxes: Story = {
  args: { axis: 'both', content: 'grid', width: 480, height: 360 },
}

export const ShadowOnCard: Story = {
  args: { edgeEffect: 'shadow' },
}

export const TintedSurface: Story = {
  name: 'Tinted surface (fade vs. tinted shadow)',
  args: { surface: 'tinted', axis: 'both', content: 'grid' },
  render: ({ content, surface, width, height, ...props }) => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      <Frame surface={surface} width={width} height={height}>
        <ScrollArea {...props} edgeEffect="fade">
          <DemoContentView content={content} />
        </ScrollArea>
      </Frame>
      <Frame surface={surface} width={width} height={height}>
        <ScrollArea
          {...props}
          edgeEffect="shadow"
          style={shadowStyle(
            'light-dark(oklch(0.45 0.12 250 / 0.35), oklch(0.12 0.05 250 / 0.75))',
          )}
        >
          <DemoContentView content={content} />
        </ScrollArea>
      </Frame>
    </div>
  ),
}

const COLOR_SCHEMES = ['light', 'dark'] as const
const COMPARED_EDGE_EFFECTS = [
  SCROLL_AREA_EDGE_EFFECT.FADE,
  SCROLL_AREA_EDGE_EFFECT.SHADOW,
] as const

export const TransparentFade: Story = {
  name: 'Fade over a busy background (transparent vs. shadow)',
  args: { surface: 'checkerboard', edgeSize: 48, width: 280, height: 240 },
  render: ({
    surface,
    shadowColor,
    width,
    height,
    content: _content,
    axis: _axis,
    edgeEffect: _edgeEffect,
    ...props
  }) => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {COLOR_SCHEMES.map((scheme) => (
        <section
          key={scheme}
          className="demo-scheme"
          style={{ colorScheme: scheme }}
        >
          <div className="demo-compare">
            {COMPARED_EDGE_EFFECTS.map((edgeEffect) => (
              <figure key={edgeEffect}>
                <figcaption className="demo-readout">
                  {scheme} · edgeEffect="{edgeEffect}"
                </figcaption>
                <Frame surface={surface} width={width} height={height}>
                  <ScrollArea
                    {...props}
                    axis="vertical"
                    edgeEffect={edgeEffect}
                    style={shadowStyle(shadowColor)}
                  >
                    <DemoContentView content="list" />
                  </ScrollArea>
                </Frame>
                <Frame surface={surface} width={width} height={64}>
                  <ScrollArea
                    {...props}
                    axis="horizontal"
                    edgeEffect={edgeEffect}
                    style={shadowStyle(shadowColor)}
                  >
                    <DemoContentView content="chips" />
                  </ScrollArea>
                </Frame>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
}

function DynamicDemo(props: StoryArgs) {
  const {
    surface,
    width,
    height,
    content: _content,
    shadowColor,
    ...rest
  } = props
  const [count, setCount] = useState(3)
  return (
    <>
      <div className="demo-toolbar">
        <button
          type="button"
          className="demo-button"
          onClick={() => setCount((n) => n + 5)}
        >
          Add 5 rows
        </button>
        <button
          type="button"
          className="demo-button"
          onClick={() => setCount((n) => Math.max(0, n - 5))}
        >
          Remove 5 rows
        </button>
        <span className="demo-readout">{count} rows</span>
      </div>
      <Frame surface={surface} width={width} height={height}>
        <ScrollArea {...rest} style={shadowStyle(shadowColor)}>
          <DemoList count={count} />
        </ScrollArea>
      </Frame>
    </>
  )
}

export const DynamicContent: Story = {
  name: 'Dynamic content (updates without scrolling)',
  render: (args) => <DynamicDemo {...args} />,
}

function ExternalRefDemo(props: StoryArgs) {
  const { surface, width, height, content, shadowColor, ...rest } = props
  const viewportRef = useRef<HTMLDivElement>(null)
  const [scrollTop, setScrollTop] = useState(0)
  const scrollTo = (top: number) =>
    viewportRef.current?.scrollTo({ top, behavior: 'smooth' })
  return (
    <>
      <div className="demo-toolbar">
        <button
          type="button"
          className="demo-button"
          onClick={() => scrollTo(0)}
        >
          Scroll to top
        </button>
        <button
          type="button"
          className="demo-button"
          onClick={() => scrollTo(viewportRef.current?.scrollHeight ?? 0)}
        >
          Scroll to bottom
        </button>
        <span className="demo-readout">scrollTop: {Math.round(scrollTop)}</span>
      </div>
      <Frame surface={surface} width={width} height={height}>
        <ScrollArea
          {...rest}
          viewportRef={viewportRef}
          onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
          style={shadowStyle(shadowColor)}
        >
          <DemoContentView content={content} />
        </ScrollArea>
      </Frame>
    </>
  )
}

export const ExternalViewportRef: Story = {
  name: 'External viewportRef',
  render: (args) => <ExternalRefDemo {...args} />,
}

export const RightToLeft: Story = {
  args: {
    dir: 'rtl',
    axis: 'horizontal',
    content: 'chips',
    width: 360,
    height: 64,
  },
}

export const AdaptersSideBySide: Story = {
  name: 'Adapters side by side',
  args: { axis: 'both', content: 'grid', width: 360, height: 320 },
  render: ({ content, surface, shadowColor, width, height, ...props }) => (
    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      {(
        [
          ['Radix', RadixScrollArea],
          ['Base UI', BaseUIScrollArea],
        ] as const
      ).map(([label, Component]) => (
        <figure key={label} style={{ margin: 0 }}>
          <figcaption className="demo-readout" style={{ marginBlockEnd: 8 }}>
            {label}
          </figcaption>
          <Frame surface={surface} width={width} height={height}>
            <Component {...props} style={shadowStyle(shadowColor)}>
              <DemoContentView content={content} />
            </Component>
          </Frame>
        </figure>
      ))}
    </div>
  ),
}
