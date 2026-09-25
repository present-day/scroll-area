// Library-agnostic API that every adapter entry re-exports.
export { mergeRefs } from './mergeRefs'
export {
  SCROLL_AREA_AXIS,
  SCROLL_AREA_EDGE_EFFECT,
  SCROLL_AREA_SCROLLBARS,
  type ScrollAreaAxis,
  type ScrollAreaClassNames,
  type ScrollAreaEdgeEffect,
  type ScrollAreaScrollbars,
  type ScrollAreaSharedProps,
} from './props'
export {
  EDGE_SIDES,
  type EdgeSide,
  type Edges,
  measureEdges,
  type ScrollAxes,
  useScrollEdges,
} from './useScrollEdges'
