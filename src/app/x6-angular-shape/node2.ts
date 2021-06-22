import { Node, Graph, ObjectExt } from '@antv/x6';

export class AngularShape extends Node {
  // get component() {
  //   return this.getComponent()
  // }
  // set component(val: AngularShape.Properties['component']) {
  //   this.setComponent(val)
  // }
  // getComponent(): AngularShape.Properties['component'] {
  //   return this.store.get('component')
  // }
  // setComponent(
  //   component: AngularShape.Properties['component'],
  //   options: Node.SetOptions = {},
  // ) {
  //   if (component == null) {
  //     this.removeComponent(options)
  //   } else {
  //     this.store.set('component', component, options)
  //   }
  //   return this
  // }
  // removeComponent(options: Node.SetOptions = {}) {
  //   this.store.remove('component', options)
  //   return this
  // }
}

AngularShape.config({
  width: 100,
  height: 40,
  markup: [
    {
      tagName: 'rect',
      selector: 'body',
    },
    {
      tagName: 'text',
      selector: 'label',
    },
  ],
  attrs: {
    body: {
      fill: '#ffffff',
      stroke: '#333333',
      strokeWidth: 2,
    },
    label: {
      fontSize: 14,
      fill: '#333333',
      refX: '50%',
      refY: '50%',
      textAnchor: 'middle',
      textVerticalAnchor: 'middle',
    },
  },
  // 通过钩子将自定义选项 label 应用到 'attrs/text/text' 属性上
  propHooks(metadata) {
    const { label, ...others } = metadata
    if (label) {
      ObjectExt.setByPath(others, 'attrs/text/text', label)
    }
    return others
  },
})

Graph.registerNode('AngularShape', AngularShape);
// export namespace AngularShape {
//   export type Primer = 'rect' | 'circle' | 'path' | 'ellipse' | 'polygon' | 'polyline';

//   export interface Properties extends Node.Properties {
//     primer?: Primer;
//     useForeignObject?: boolean;
//     component?: Definition | string;
//   }
// }
