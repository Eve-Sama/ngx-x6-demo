import { Graph, FunctionExt } from '@antv/x6'
import { Definition } from './registry'
import { AngularShape } from './node'
import { Injector } from '@angular/core'

declare module '@antv/x6/lib/graph/hook' {
  namespace Hook {
    interface IHook {
      getAngularContent(this: Graph, node: AngularShape): Definition
      getAngularInjector(this: Graph, node: AngularShape): Injector
    }
  }

  interface Hook {
    getAngularContent(node: AngularShape): Definition
    getAngularInjector(node: AngularShape): Injector
  }
}

Graph.Hook.prototype.getAngularContent = function (node: AngularShape) {
  const getAngularContent = this.options.getAngularContent
  if (typeof getAngularContent === 'function') {
    const ret = FunctionExt.call(getAngularContent, this.graph, node)
    if (ret != null) {
      return ret
    }
  }

  let ret = node.getContent();

  return ret as Definition
}

Graph.Hook.prototype.getAngularInjector = function (node: AngularShape) {
  const res = node.getInjector();
  if (!res) {
    throw new Error(`x6-angular-shape: You have to pass param 'injector' and it should be the instance of Injector!`);
  }
  return res as Injector;
}
