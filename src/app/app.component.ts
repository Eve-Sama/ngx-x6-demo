import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Graph, Edge, Shape, Cell } from '@antv/x6';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('container') container: ElementRef;
  graph: Graph;

  addNode1(): void {
    // 创建节点
    const rect = new Shape.Rect({
      x: 100,
      y: 50,
      width: 80,
      height: 40,
      attrs: {
        body: {
          fill: 'blue'
        },
        label: {
          text: 'Hello',
          fill: 'white'
        }
      }
    });
    // 添加到画布
    this.graph.addNode(rect);
  }

  addNode2(): void {
    const rect = this.graph.addNode({
      shape: 'rect', // 指定使用何种图形，默认值为 'rect'
      x: 100,
      y: 150,
      width: 80,
      height: 40,
      attrs: {
        body: {
          fill: 'blue'
        },
        label: {
          text: 'Hello',
          fill: 'white'
        }
      }
    });
  }

  addNode3(): void {
    const data = {
      shape: 'html',
      x: 100,
      y: 250,
      width: 80,
      height: 40,
      html: {
        // 节点内容, 使用HTML进行渲染
        render(node: Cell): HTMLDivElement {
          const wrap = document.createElement('div');
          wrap.className = 'created-by-html';
          wrap.innerHTML = 'Hello';
          return wrap;
        },
        // 控制节点重新渲染
        shouldComponentUpdate(node: Cell): boolean {
          return node.hasChanged('data');
        }
      }
    };
    const cell = this.graph.createNode(data);
    this.graph.addCell(cell);
  }

  addEdge(): void {
    this.graph.clearCells();
    const node1 = new Shape.Rect({
      x: 100,
      y: 100,
      width: 80,
      height: 40,
      attrs: {
        label: {
          text: 'Hello'
        }
      }
    });
    const node2 = new Shape.Rect({
      x: 300,
      y: 100,
      width: 80,
      height: 40,
      attrs: {
        label: {
          text: 'Hello'
        }
      }
    });
    const edge = new Shape.Edge({
      source: node1,
      target: node2,
    })
    setTimeout(() => {
      this.graph.addCell(node1);
    }, 500);
    setTimeout(() => {
      this.graph.addCell(node2);
    }, 1000);
    setTimeout(() => {
      this.graph.addCell(edge);
    }, 1500);
  }

  private initGraph(): void {
    const that = this;
    this.graph = new Graph({
      container: that.container.nativeElement,
      panning: true, // 画布拖拽
      selecting: true,
      width: document.body.scrollWidth,
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

  // 必须是在这个钩子中初始化
  ngAfterViewInit(): void {
    this.initGraph();
  }
}
