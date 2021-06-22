import { NodeView, Scheduler } from '@antv/x6'
import { AngularShape } from './node'

export class AngularShapeView extends NodeView<AngularShape> {
  protected init() {
    super.init()
  }

  getComponentContainer() {
    return this.selectors.foContent as HTMLDivElement
  }

  confirmUpdate(flag: number) {
    const ret = super.confirmUpdate(flag)
    return this.handleAction(ret, AngularShapeView.action, () => {
      Scheduler.scheduleTask(() => {
        this.renderAngularComponent()
      })
    })
  }

  protected renderAngularComponent() {
    this.unmountAngularComponent()
    const root = this.getComponentContainer()
    const node = this.cell
    const graph = this.graph

    if (root) {
      const component = this.graph.hook.getAngularComponent(node)
      // const elem = React.createElement(Wrap, { graph, node, component })
      // if (Portal.isActive()) {
      //   Portal.connect(this.cell.id, ReactDOM.createPortal(elem, root))
      // } else {
      //   ReactDOM.render(elem, root)
      // }
    }
  }

  protected unmountAngularComponent() {
    const root = this.getComponentContainer()
    root.innerHTML = ''
    return root
  }

  unmount() {
    this.unmountAngularComponent()
    return this
  }

  @NodeView.dispose()
  dispose() {
    this.unmountAngularComponent()
  }
}

export namespace AngularShapeView {
  export const action = 'angular' as any

  AngularShapeView.config({
    bootstrap: [action],
    actions: {
      component: action,
    },
  })

  NodeView.registry.register('angular-shape-view', AngularShapeView, true)
}
