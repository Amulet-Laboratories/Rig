// useForceGraph — shared utilities for D3 force-directed graph components.
// Creates drag behaviors and click-to-highlight interactions.
//
// Named imports here are deliberate — `import * as d3 from 'd3'` defeats
// Rollup tree-shaking, which pulls the entire d3 + data-package code into
// any consumer's bundle even when they don't use spatial graphs.

import { drag } from 'd3'
import type {
  BaseType,
  DragBehavior,
  Selection,
  Simulation,
  SimulationLinkDatum,
  SimulationNodeDatum,
  SubjectPosition,
} from 'd3'

/**
 * Create a drag behavior that pins / unpins simulation nodes.
 * Pass a getter so the simulation reference can be updated across renders.
 *
 * @example
 * ```ts
 * const drag = createDragBehavior(() => simulation)
 * nodeGroups.call(drag)
 * ```
 */
export function createDragBehavior<N extends SimulationNodeDatum>(
  getSimulation: () => Simulation<N, SimulationLinkDatum<N>> | null,
): DragBehavior<SVGGElement, N, N | SubjectPosition> {
  return drag<SVGGElement, N>()
    .on('start', (event, d) => {
      if (!event.active) getSimulation()?.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    })
    .on('drag', (event, d) => {
      d.fx = event.x
      d.fy = event.y
    })
    .on('end', (event, d) => {
      if (!event.active) getSimulation()?.alphaTarget(0)
      d.fx = null
      d.fy = null
    })
}

export interface GraphHighlightOptions<
  N extends SimulationNodeDatum & { id: string },
  L extends SimulationLinkDatum<N>,
> {
  links: L[]
  nodes: Selection<SVGGElement, N, SVGGElement | null, unknown>
  linkLines: Selection<BaseType, L, SVGGElement | null, unknown>
  svg: Selection<SVGSVGElement, unknown, null, undefined>
  defaultLinkOpacity: number
}

/**
 * Wire up click-to-highlight on a force-directed graph.
 * Click a node to dim all unconnected nodes/links; click again or background to reset.
 */
export function applyGraphHighlight<
  N extends SimulationNodeDatum & { id: string },
  L extends SimulationLinkDatum<N>,
>(opts: GraphHighlightOptions<N, L>): void {
  const { links, nodes, linkLines, svg, defaultLinkOpacity } = opts
  let selected: string | null = null

  nodes.on('click', (event, d) => {
    event.stopPropagation()
    if (selected === d.id) {
      selected = null
      nodes.attr('opacity', 1)
      linkLines.attr('opacity', defaultLinkOpacity)
    } else {
      selected = d.id
      const connected = new Set<string>([d.id])
      links.forEach((l) => {
        const sId = typeof l.source === 'object' ? (l.source as N).id : String(l.source)
        const tId = typeof l.target === 'object' ? (l.target as N).id : String(l.target)
        if (sId === d.id) connected.add(tId)
        if (tId === d.id) connected.add(sId)
      })
      nodes.attr('opacity', (n) => (connected.has(n.id) ? 1 : 0.15))
      linkLines.attr('opacity', (l) => {
        const sId = typeof l.source === 'object' ? (l.source as N).id : String(l.source)
        const tId = typeof l.target === 'object' ? (l.target as N).id : String(l.target)
        return sId === d.id || tId === d.id ? 0.8 : 0.05
      })
    }
  })

  svg.on('click', () => {
    selected = null
    nodes.attr('opacity', 1)
    linkLines.attr('opacity', defaultLinkOpacity)
  })
}
