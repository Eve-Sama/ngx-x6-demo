import { Component, ComponentFactoryResolver } from '@angular/core';
import { NodeView, Scheduler } from '@antv/x6';
import { AngularShape } from './node';

export class AngularShapeView extends NodeView<AngularShape> {
  protected init() {
    super.init();
  }
  componentFactoryResolve: ComponentFactoryResolver
  getComponentContainer() {
    return this.selectors.foContent as HTMLDivElement;
  }

  confirmUpdate(flag: number) {
    const ret = super.confirmUpdate(flag);
    return this.handleAction(ret, AngularShapeView.action, () => {
      Scheduler.scheduleTask(() => {
        this.renderAngularComponent();
      });
    });
  }

  protected renderAngularComponent() {
    this.unmountAngularComponent();
    const root = this.getComponentContainer();
    const node = this.cell;

    // root is a host element, also be a ordinary dom
    if (root) {
      const component = this.graph.hook.getAngularComponent(node) as any;
      console.log(component, `component`);
      const cfr = this.graph.hook.getAngularCfr(node);
      console.log(cfr, `cfr`);
      const componentFactory = cfr.resolveComponentFactory(component);
      console.log(componentFactory, `componentFactory`);
      // The last problem is how to transform root to ViewContainerRef. 
      // const componentRef = this.answerComponentRef.createComponent(componentFactory);
    }
  }

  protected unmountAngularComponent() {
    const root = this.getComponentContainer();
    root.innerHTML = '';
    return root;
  }

  unmount() {
    this.unmountAngularComponent();
    return this;
  }

  @NodeView.dispose()
  dispose() {
    this.unmountAngularComponent();
  }
}

export namespace AngularShapeView {
  export const action = 'angular' as any;

  AngularShapeView.config({
    bootstrap: [action],
    actions: {
      component: action
    }
  });

  NodeView.registry.register('angular-shape-view', AngularShapeView, true);
}
