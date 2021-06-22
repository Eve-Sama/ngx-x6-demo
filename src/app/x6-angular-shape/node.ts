import { ComponentFactoryResolver } from '@angular/core'
import { Node, Markup, ObjectExt } from '@antv/x6'
import { Definition } from './registry'

export class AngularShape<
  Properties extends AngularShape.Properties = AngularShape.Properties,
> extends Node<Properties> {
  get component() {
    return this.getComponent()
  }

  set component(val: AngularShape.Properties['component']) {
    this.setComponent(val)
  }

  getComponent(): AngularShape.Properties['component'] {
    return this.store.get('component')
  }

  getCfr(): ComponentFactoryResolver {
    return this.store.get('cfr')
  }

  setComponent(
    component: AngularShape.Properties['component'],
    options: Node.SetOptions = {},
  ) {
    if (component == null) {
      this.removeComponent(options)
    } else {
      this.store.set('component', component, options)
    }
    return this
  }

  removeComponent(options: Node.SetOptions = {}) {
    this.store.remove('component', options)
    return this
  }
}

export namespace AngularShape {
  export type Primer =
    | 'rect'
    | 'circle'
    | 'path'
    | 'ellipse'
    | 'polygon'
    | 'polyline'

  export interface Properties extends Node.Properties {
    primer?: Primer
    useForeignObject?: boolean
    component?: Definition | string
  }
}

export namespace AngularShape {
  function getMarkup(useForeignObject: boolean, primer: Primer = 'rect') {
    const markup: Markup.JSONMarkup[] = [
      {
        tagName: primer,
        selector: 'body',
      },
    ]

    if (useForeignObject) {
      markup.push(Markup.getForeignObjectMarkup())
    } else {
      markup.push({
        tagName: 'g',
        selector: 'content',
      })
    }

    markup.push({
      tagName: 'text',
      selector: 'label',
    })

    return markup
  }
  const data ={
    view: 'angular-shape-view',
    markup: getMarkup(true),
    attrs: {
      body: {
        fill: 'none',
        stroke: 'none',
        refWidth: '100%',
        refHeight: '100%',
      },
      fo: {
        refWidth: '100%',
        refHeight: '100%',
      },
      label: {
        fontSize: 14,
        fill: '#333',
        refX: '50%',
        refY: '50%',
        textAnchor: 'middle',
        textVerticalAnchor: 'middle',
      },
    },
    propHooks(metadata: Properties) {
      if (metadata.markup == null) {
        const primer = metadata.primer
        const useForeignObject = metadata.useForeignObject
        if (primer != null || useForeignObject != null) {
          metadata.markup = getMarkup(useForeignObject !== false, primer)
          if (primer) {
            if (metadata.attrs == null) {
              metadata.attrs = {}
            }
            let attrs = {}
            if (primer === 'circle') {
              attrs = {
                refCx: '50%',
                refCy: '50%',
                refR: '50%',
              }
            } else if (primer === 'ellipse') {
              attrs = {
                refCx: '50%',
                refCy: '50%',
                refRx: '50%',
                refRy: '50%',
              }
            }

            if (primer !== 'rect') {
              metadata.attrs = ObjectExt.merge({}, metadata.attrs, {
                body: {
                  refWidth: null,
                  refHeight: null,
                  ...attrs,
                },
              })
            }
          }
        }
      }
      return metadata
    },
  }
  AngularShape.config(data as any);

  Node.registry.register('angular-shape', AngularShape, true)
}
