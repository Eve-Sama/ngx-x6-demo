import { Graph, FunctionExt } from '@antv/x6'
import { registry, Definition } from './registry'
import { AngularShape } from './node'
import { ComponentFactoryResolver } from '@angular/core'

declare module '@antv/x6/lib/graph/hook' {
  namespace Hook {
    interface IHook {
      getAngularComponent(this: Graph, node: AngularShape): Definition
      getAngularCfr(this: Graph, node: AngularShape): ComponentFactoryResolver
    }
  }

  interface Hook {
    getAngularComponent(node: AngularShape): Definition
    getAngularCfr(node: AngularShape): ComponentFactoryResolver
  }
}

Graph.Hook.prototype.getAngularComponent = function (node: AngularShape) {
  const getAngularComponent = this.options.getAngularComponent
  if (typeof getAngularComponent === 'function') {
    const ret = FunctionExt.call(getAngularComponent, this.graph, node)
    if (ret != null) {
      return ret
    }
  }

  let ret = node.getComponent()
  if (typeof ret === 'string') {
    const component = registry.get(ret)
    if (component == null) {
      return registry.onNotFound(ret)
    }
    ret = component
  }

  return ret as Definition
}

Graph.Hook.prototype.getAngularCfr = function (node: AngularShape) {
  const res = node.getCfr();
  if (!res) {
    throw new Error(`x6-angular-shape: You have to pass param 'cfr' and it should be the instance of ComponentFactoryResolver!`);
  }
  return res as ComponentFactoryResolver;
}
