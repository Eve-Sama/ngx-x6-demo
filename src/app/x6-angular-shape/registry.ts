import { Component, TemplateRef } from '@angular/core'
import { Graph, Node, Registry } from '@antv/x6'

export type Definition = ((this: Graph, node: Node) => TemplateRef<{}> | Component | null | undefined)

export const registry = Registry.create<Definition>({
  type: 'angular componnet',
})

declare module '@antv/x6/lib/graph/graph' {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  namespace Graph {
    let registerAngularComponent: typeof registry.register
    let unregisterAngularComponent: typeof registry.unregister
  }
}

Graph.registerAngularComponent = registry.register
Graph.unregisterAngularComponent = registry.unregister
