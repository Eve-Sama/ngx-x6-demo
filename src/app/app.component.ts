import { Component, ElementRef, ViewChild } from '@angular/core';
import { Graph, Edge, Shape } from '@antv/x6';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  type: 'init-graph' | 'add-node' | '' = '';
  
  @ViewChild('container') container: ElementRef;
  graph: Graph;

  initGraph(): void {
    const that = this;
    this.graph = new Graph({
      container: that.container.nativeElement,
      panning: true, // 画布拖拽
      selecting: true,
      width: 600,
      height: 400,
      background: { color: '#f7f8fa' },
      connecting: {
        snap: true, // 连线的过程中距离节点或者连接桩 50px 时会触发自动吸附
        // highlight: true, // 拖动边时，是否高亮显示所有可用的连接桩或节点 如果开启这个选项, 会导致validateConnection在一开始就触发一次
        allowBlank: false, // 是否允许连接到画布空白位置的点
        allowLoop: false, // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点
        allowNode: false, // 是否允许边链接到节点（非节点上的链接桩）
        allowEdge: false, // 是否允许边链接到另一个边
        // connector: 'algo-edge',
        connector: 'rounded',
        connectionPoint: 'boundary',
        // 连接线的样式
        createEdge(): Edge<Edge.Properties> {
          return new Shape.Edge({
            router: { name: 'manhattan' }
          });
        },
        // 是否允许创建连接线(连出的时候)
        // tslint:disable-next-line: typedef
        validateMagnet({ cell, magnet }): boolean {
          return true;
        },
        // 是否允许创建连接线(连入的时候)
        // tslint:disable-next-line: typedef
        validateConnection({
          edge,
          edgeView,
          sourceView,
          targetView,
          sourcePort,
          targetPort,
          sourceMagnet,
          targetMagnet,
          sourceCell,
          targetCell,
          type
        }) {
          return true;
        }
      }
    });
  }
}
