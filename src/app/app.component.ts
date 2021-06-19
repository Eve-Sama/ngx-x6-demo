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

  // 添加节点(构造函数)
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

  // 添加节点(graph自带)
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

  // 添加节点(HTML)
  addNode3(): void {
    const data = {
      shape: 'html', // 必须指定为html
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

  clear(): void {
    this.graph.clearCells();
  }

  // 添加边(节点对节点)
  addEdgeWithNode(): void {
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
      target: node2
    });
    setTimeout(() => this.graph.addCell(node1), 500);
    setTimeout(() => this.graph.addCell(node2), 1000);
    setTimeout(() => this.graph.addCell(edge), 1500);
  }

  // 添加桩点(无连接线)
  addPort(): void {
    this.graph.clearCells();
    // 连接节点分组, 定义好入口和出口样式
    const groups = {
      in: {
        position: 'left',
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#CCD4E0',
            strokeWidth: 1,
            fill: '#fff'
          }
        }
      },
      out: {
        position: 'right',
        attrs: {
          circle: {
            r: 5,
            magnet: true, // 是否允许吸附
            stroke: '#CCD4E0',
            strokeWidth: 1,
            fill: '#fff'
          }
        }
      }
    };
    const node1 = new Shape.Rect({
      x: 100,
      y: 100,
      width: 80,
      height: 40,
      attrs: {
        label: {
          text: 'Hello'
        }
      },
      ports: {
        groups,
        items: [{ group: 'out' }]
      }
    });
    console.log(node1, `node1`);
    const node2 = new Shape.Rect({
      x: 300,
      y: 100,
      width: 80,
      height: 40,
      attrs: {
        label: {
          text: 'Hello'
        }
      },
      ports: {
        groups,
        items: [{ group: 'in' }]
      }
    });
    setTimeout(() => this.graph.addCell(node1), 500);
    setTimeout(() => this.graph.addCell(node2), 1000);
  }

  // 添加桩点(有连接线)
  addPortWithEdge(): void {
    this.graph.clearCells();
    // 定义好入口和出口样式
    const groups = {
      in: {
        position: 'left',
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#CCD4E0',
            strokeWidth: 1,
            fill: '#fff'
          }
        }
      },
      out: {
        position: 'right',
        attrs: {
          circle: {
            r: 5,
            magnet: true, // 是否允许吸附
            stroke: '#CCD4E0',
            strokeWidth: 1,
            fill: '#fff'
          }
        }
      }
    };
    const node1 = new Shape.Rect({
      x: 100,
      y: 100,
      width: 80,
      height: 40,
      attrs: {
        label: {
          text: 'Hello'
        }
      },
      ports: {
        groups,
        items: [{ group: 'out' }]
      }
    });
    console.log(node1, `node1`);
    const node2 = new Shape.Rect({
      x: 300,
      y: 100,
      width: 80,
      height: 40,
      attrs: {
        label: {
          text: 'Hello'
        }
      },
      ports: {
        groups,
        items: [{ group: 'in' }]
      }
    });
    setTimeout(() => this.graph.addCell(node1), 500);
    setTimeout(() => this.graph.addCell(node2), 1000);
    setTimeout(() => {
      const data = this.graph.toJSON();
      const node1Data = data.cells[0];
      const node2Data = data.cells[1];
      const edgeData = {
        source: { cell: node1Data.id, port: node1Data.ports.items[0].id },
        target: { cell: node2Data.id, port: node2Data.ports.items[0].id }
      };
      const edge = new Shape.Edge(edgeData);
      this.graph.addCell(edge);
    }, 1500);
  }

  /** 躲避障碍物的连接线 */
  addPortWithManhattan(): void {
    this.graph.clearCells();
    // 定义好入口和出口样式
    const groups = {
      in: {
        position: 'left',
        attrs: {
          circle: {
            r: 5,
            magnet: true,
            stroke: '#CCD4E0',
            strokeWidth: 1,
            fill: '#fff'
          }
        }
      },
      out: {
        position: 'right',
        attrs: {
          circle: {
            r: 5,
            magnet: true, // 是否允许吸附
            stroke: '#CCD4E0',
            strokeWidth: 1,
            fill: '#fff'
          }
        }
      }
    };
    const node1 = new Shape.Rect({
      x: 100,
      y: 100,
      width: 80,
      height: 40,
      attrs: {
        label: {
          text: 'Hello'
        }
      },
      ports: {
        groups,
        items: [{ group: 'out' }]
      }
    });
    console.log(node1, `node1`);
    const node2 = new Shape.Rect({
      x: 300,
      y: 100,
      width: 80,
      height: 40,
      attrs: {
        label: {
          text: 'Hello'
        }
      },
      ports: {
        groups,
        items: [{ group: 'in' }]
      }
    });
    setTimeout(() => this.graph.addCell(node1), 500);
    setTimeout(() => this.graph.addCell(node2), 1000);
    setTimeout(() => {
      const data = this.graph.toJSON();
      const node1Data = data.cells[0];
      const node2Data = data.cells[1];
      const edgeData = {
        router: { name: 'manhattan' },
        source: { cell: node1Data.id, port: node1Data.ports.items[0].id },
        target: { cell: node2Data.id, port: node2Data.ports.items[0].id }
      };
      const edge = new Shape.Edge(edgeData);
      this.graph.addCell(edge);
    }, 1500);
  }

  print(): void {
    const data = this.graph.toJSON();
    console.log(data, `画布的结果转化为JSON`);
  }

  /** x6画布的一些基础属性 */
  graphBasicConfig = {
    panning: true, // 画布拖拽
    selecting: true,
    width: document.body.scrollWidth,
    height: 400,
    background: { color: '#f7f8fa' },
    connecting: {
      snap: true, // 连线的过程中距离节点或者连接桩 50px 时会触发自动吸附
      allowBlank: false, // 是否允许连接到画布空白位置的点
      allowLoop: false, // 是否允许创建循环连线，即边的起始节点和终止节点为同一节点
      allowNode: false, // 是否允许边链接到节点（非节点上的链接桩）
      allowEdge: false, // 是否允许边链接到另一个边
      connector: 'rounded',
      connectionPoint: 'boundary'
    }
  };

  private initGraph(): void {
    const graphConfig = {
      ...this.graphBasicConfig,
      container: this.container.nativeElement,
      // 连接线的样式
      createEdge(): Edge<Edge.Properties> {
        return new Shape.Edge({
          router: { name: 'normal' }
        });
      }
    };
    this.graph = new Graph(graphConfig);
  }

  // 必须是在这个钩子中初始化
  ngAfterViewInit(): void {
    this.initGraph();
  }
}
