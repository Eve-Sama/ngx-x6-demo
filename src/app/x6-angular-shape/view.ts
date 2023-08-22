import { ComponentRef, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';
import { NodeView, Scheduler } from '@antv/x6';
import { AngularShape } from './node';
import { Content } from './registry';

export class AngularShapeView extends NodeView<AngularShape> {
  protected init() {
    super.init();
  }

  getContentContainer() {
    return this.selectors.foContent as HTMLDivElement;
  }

  confirmUpdate(flag: number) {
    const ret = super.confirmUpdate(flag);
    return this.handleAction(ret, AngularShapeView.action, () => {
      Scheduler.scheduleTask(() => this.renderAngularContent());
    });
  }

  private getNgArguments(): Record<string, any> {
    const input = (this.cell.data?.ngArguments as Record<string, any>) || {};
    return input;
  }

  /** 当执行 node.setData() 时需要对实例设置新的输入值 */
  private setInstanceInput(content: Content, ref: EmbeddedViewRef<any> | ComponentRef<any>): void {
    const ngArguments = this.getNgArguments();
    if (content instanceof TemplateRef) {
      const embeddedViewRef = ref as EmbeddedViewRef<any>;
      embeddedViewRef.context = { ngArguments };
    } else {
      const componentRef = ref as ComponentRef<any>;
      Object.keys(ngArguments).forEach(v => componentRef.setInput(v, ngArguments[v]));
      componentRef.changeDetectorRef.detectChanges();
    }
  }

  protected renderAngularContent() {
    this.unmountAngularContent();
    const container = this.getContentContainer();
    if (container) {
      const node = this.cell;
      const { injector, content } = this.graph.hook.getAngularContent(node);
      const viewContainerRef = injector.get(ViewContainerRef);
      if (content instanceof TemplateRef) {
        const ngArguments = this.getNgArguments();
        const embeddedViewRef = viewContainerRef.createEmbeddedView(content, { ngArguments });
        embeddedViewRef.rootNodes.forEach(node => container.appendChild(node));
        embeddedViewRef.detectChanges();
        node.on('change:data', () => this.setInstanceInput(content, embeddedViewRef));
      } else {
        const componentRef = viewContainerRef.createComponent(content);
        const insertNode = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        container.appendChild(insertNode);
        this.setInstanceInput(content, componentRef);
        node.on('change:data', () => this.setInstanceInput(content, componentRef));
        node.on('removed', () => componentRef.destroy());
      }
    }
  }

  protected unmountAngularContent() {
    const root = this.getContentContainer();
    root.innerHTML = '';
    return root;
  }

  unmount() {
    this.unmountAngularContent();
    return this;
  }

  @NodeView.dispose()
  dispose() {
    this.unmountAngularContent();
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
