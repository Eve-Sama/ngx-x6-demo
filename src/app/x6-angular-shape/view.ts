import { ApplicationRef, Component, ComponentFactoryResolver, TemplateRef, ViewContainerRef } from '@angular/core';
import { NodeView, Scheduler } from '@antv/x6';
import { AngularShape } from './node';
import { ComponentPortal, DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';

export class AngularShapeView extends NodeView<AngularShape> {
  protected init() {
    super.init();
  }
  componentFactoryResolve: ComponentFactoryResolver;
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
      const content = this.graph.hook.getAngularContent(node);
      const injector = this.graph.hook.getAngularInjector(node);
      const applicationRef = injector.get(ApplicationRef);
      const viewContainerRef = injector.get(ViewContainerRef);
      const componentFactoryResolver = injector.get(ComponentFactoryResolver);
      const domOutlet = new DomPortalOutlet(root, componentFactoryResolver, applicationRef, injector);
      if (content instanceof TemplateRef) {
        const portal = new TemplatePortal(content, viewContainerRef);
        domOutlet.attachTemplatePortal(portal);
      } else if (content instanceof Component) {
        // const content2 = content as unknown as ComponentType<T>;
        const portal = new ComponentPortal(content as any, viewContainerRef);
        domOutlet.attachComponentPortal(portal);
      }
      // const portal = new ComponentPortal(component);
      // const {componentFactoryResolver, applicationRef, injector} = injector2;
      // const domOutlet = new DomPortalOutlet(root, componentFactoryResolver, applicationRef, injector);
      // domOutlet.attachComponentPortal(component);

      // const component = this.graph.hook.getAngularComponent(node) as any;
      // console.log(component, `component`);
      // const cfr = this.graph.hook.getAngularCfr(node);
      // console.log(cfr, `cfr`);
      // const injector = this.graph.hook.getAngularInjector(node) as any;
      // console.log(injector, `injector`);
      // const componentFactoryResolver = injector.get(ComponentFactoryResolver);
      // const applicationRef = injector.get(ApplicationRef);
      // const viewContainerRef = injector.get(ViewContainerRef);
      // const portal = new TemplatePortal(component as any, viewContainerRef);
      // const domOutlet = new DomPortalOutlet(root, componentFactoryResolver, applicationRef, injector);
      // domOutlet.attachTemplatePortal(portal);
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
