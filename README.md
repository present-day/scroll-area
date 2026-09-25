# @present-day/scroll-area

A Radix or Base UI scroll area that shows where more content is hidden, using an edge fade or a theme-aware shadow. It supports light and dark mode, RTL, and never re-renders while scrolling.

**[▶ Try it in Storybook](https://present-day.github.io/scroll-area/)**

Install it with the primitive library you use. Both are optional peer dependencies:

```bash
bun add @present-day/scroll-area @radix-ui/react-scroll-area
# or
bun add @present-day/scroll-area @base-ui/react
```

```tsx
import { ScrollArea } from '@present-day/scroll-area'         // Radix (also '/radix')
import { ScrollArea } from '@present-day/scroll-area/base-ui' // Base UI

<div style={{ height: 320 }}>
  <ScrollArea edgeEffect="shadow">{items}</ScrollArea>
</div>
```

Both adapters take the same props and produce the same DOM contract, so switching is an import change. Styles load automatically with either entry. To load them yourself instead, import `@present-day/scroll-area/styles.css`.

## Props

| Prop | Type | Default | |
| --- | --- | --- | --- |
| `axis` | `"vertical" \| "horizontal" \| "both"` | `"vertical"` | Which directions scroll |
| `edgeEffect` | `"fade" \| "shadow" \| "none"` | `"fade"` | How hidden content is signaled |
| `edgeSize` | `number \| string` | `24px` (token) | Depth of the edge effect; numbers are px |
| `scrollbars` | `"hover" \| "scroll" \| "auto" \| "always" \| "hidden"` | `"hover"` | When scrollbars show; `"hidden"` still scrolls |
| `dir` | `"ltr" \| "rtl"` | inherited | Reading direction |
| `classNames` | `{ root, viewport, scrollbar, thumb }` | | Classes for internal parts (Base UI adds `content`) |
| `viewportRef` | `Ref<HTMLDivElement>` | | The scrolling element (object or callback ref) |
| `ref` | `Ref<HTMLDivElement>` | | The root element |

Every other `Root` prop of the underlying library passes through. That includes `scrollHideDelay` and `asChild` for Radix, and `render` and `overflowEdgeThreshold` for Base UI.

### Option objects

Every union prop also has an `as const` object in SCREAMING_SNAKE_CASE, next to its PascalCase type. Either form works:

```tsx
import { SCROLL_AREA_EDGE_EFFECT, ScrollArea } from '@present-day/scroll-area'

<ScrollArea edgeEffect={SCROLL_AREA_EDGE_EFFECT.SHADOW} />
<ScrollArea edgeEffect="shadow" />
```

| Object | Type |
| --- | --- |
| `SCROLL_AREA_AXIS` | `ScrollAreaAxis` |
| `SCROLL_AREA_EDGE_EFFECT` | `ScrollAreaEdgeEffect` |
| `SCROLL_AREA_SCROLLBARS` | `ScrollAreaScrollbars` |

`Object.values(...)` lists the allowed values.

### Adapter differences

| | Radix | Base UI |
| --- | --- | --- |
| Composition | `asChild` | `render` |
| Content wrapper | hidden `display: table` div | `Content` part (`classNames.content`) |
| `scrollbar="hover" \| "scroll"` | handled by Radix (`scrollHideDelay`) | CSS, keyed off Base UI's `data-hovering` / `data-scrolling` |
| RTL | `dir` attribute | `dir` attribute plus a `DirectionProvider` when `dir` is set |
| Keyboard | viewport not focusable | viewport focusable while it overflows |

## Edge effects

- **fade** masks the content itself, so it blends into any background with no color setup.
- **shadow** draws `--scroll-area-shadow-color` over the edge. Use it when content should stay fully opaque.
- **none** draws nothing.

The root always carries `data-overflow-top|right|bottom|left` attributes for your own styling. It also carries `data-edge-effect`, `data-scrollbars`, and `data-primitive` (`radix` or `base-ui`).

## Theming

Colors use `light-dark()` and follow the inherited `color-scheme`. The package never sets `color-scheme` itself:

```css
:root { color-scheme: light dark; }        /* follow the OS */
[data-theme="dark"] { color-scheme: dark; } /* or force a mode */
```

Override these tokens on any ancestor:

| Token | Default |
| --- | --- |
| `--scroll-area-edge-size` | `24px` |
| `--scroll-area-edge-fade-min` | `transparent` |
| `--scroll-area-shadow-color` | `light-dark(rgb(0 0 0 / .16), rgb(0 0 0 / .6))` |
| `--scroll-area-thumb-color` | `light-dark(rgb(0 0 0 / .28), rgb(255 255 255 / .28))` |
| `--scroll-area-thumb-color-hover` | `light-dark(rgb(0 0 0 / .45), rgb(255 255 255 / .45))` |
| `--scroll-area-thumb-size` | `6px` |
| `--scroll-area-touch-target` | `24px` |
| `--scroll-area-content-display` | `table` (Radix) / `block` (Base UI) |

## Building blocks

`useScrollEdges(targetRef, { horizontal, vertical })` returns a callback ref for any scrolling element and mirrors its edges as `data-overflow-*` on the target. Each entry also exports its parts (`Root`, `Viewport`, `Scrollbar`, `Thumb`, `Corner`, and `Content` for Base UI) with the `sa-` classes applied, plus `mergeRefs`, for custom layouts.

## Development

```bash
bun run storybook   # http://localhost:6006 (toolbar: Theme, Adapter)
bun run test
bun run build
```
