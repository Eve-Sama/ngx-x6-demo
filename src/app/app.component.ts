import { AfterViewInit, Component, ElementRef, Injector, TemplateRef, ViewChild } from '@angular/core';
import { Graph, Shape, Cell, Addon } from '@antv/x6';
import { HTML } from '@antv/x6/lib/shape/standard';
import { Subject } from 'rxjs';
import { Heros, HeroType } from './app.config';
import { AppService } from './app.service';
import { NodeComponent } from './node-component/node.component';
import './x6-angular-shape/index';
// import '@antv/x6-angular-shape'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  Heros = Heros;

  @ViewChild('container') container: ElementRef;
  @ViewChild('demoTpl') demoTpl: TemplateRef<{}>;
  @ViewChild('dataTpl') dataTpl: TemplateRef<{}>;

  graph: Graph;
  dnd: Addon.Dnd;
  dndFinishWithJudge: boolean;
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

  removeNode(): void {
    this.graph.clearCells();
    this.addNode1();
    this.graph.on('node:mouseenter', (args: { node: HTML }) => {
      args.node.addTools({
        name: 'button-remove', // x6 自带的tool类型
        // 覆盖删除按钮自带的配置
        args: {
          markup: [
            {
              tagName: 'circle',
              selector: 'button',
              attrs: {
                r: 8,
                fill: '#ACB3BD',
                cursor: 'pointer'
              }
            },
            {
              tagName: 'path',
              selector: 'icon',
              attrs: {
                d: 'M -3 -3 3 3 M -3 3 3 -3',
                fill: '#fff',
                'stroke-width': 2,
                'pointer-events': 'none'
              }
            }
          ],
          x: '100%',
          onClick(config: { view: any; btn: any }): void {
            const { view, btn } = config;
            btn.parent.remove();
            view.cell.remove({ ui: true, toolId: btn.cid });
          }
        }
      });
    });
    this.graph.on('node:mouseleave', (args: { node: HTML }) => {
      args.node.removeTools();
    });
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
  addPortWithoutEdge(): void {
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

  initDndWithJudge(): void {
    const that = this;
    // #region 重新渲染画布参数
    const graphConfig: { [key: string]: any } = {
      ...this.graphBasicConfig,
      container: this.container.nativeElement
    };
    // 是否允许创建连接线(连出的时候)
    graphConfig.connecting.validateMagnet = (config: { cell: any }) => {
      const label = config.cell.data.label as HeroType;
      if (label === 'Morgana') {
        alert('莫甘娜: 我不会主动攻击人啊, 嘤嘤嘤~');
        return false;
      }
      return true;
    };
    // 是否允许创建连接线(连入的时候)
    graphConfig.connecting.validateConnection = (config: {
      edge: any;
      edgeView: any;
      sourceView: any;
      targetView: any;
      sourcePort: any;
      targetPort: any;
      sourceMagnet: any;
      targetMagnet: any;
      sourceCell: any;
      targetCell: any;
      type: any;
    }) => {
      console.log(config, `config`);
      const { sourceCell, targetCell } = config;
      const label = sourceCell.data.label as HeroType;
      if (label !== 'Morgana') {
        const incomingEdges = that.graph.getOutgoingEdges(sourceCell) || [];
        if (incomingEdges.length > 1) {
          alert('提莫: 打一下就跑! 再打要挨揍了!');
          return false;
        }
      }
      return true;
    };
    this.graph = new Graph(graphConfig);
    // #endregion
    // #region 初始化拖拽的参数
    const { Dnd } = Addon;
    this.dnd = new Dnd({
      target: this.graph,
      validateNode(node, options): boolean {
        const label = node.data.label as HeroType;
        if (label === 'Yasuo') {
          alert('禁止使用孤儿英雄!');
          return false;
        }
        return true;
      }
    });
    // #endregion
    this.dndFinishWithJudge = true;
  }

  /** 使用曼哈顿路由, 也就是让节点的连接线避开节点 */
  manhattan(): void {
    const graphConfig: { [key: string]: any } = {
      ...this.graphBasicConfig,
      container: this.container.nativeElement
    };
    graphConfig.connecting.createEdge = () => {
      return new Shape.Edge({
        router: { name: 'manhattan' }
      });
    };
    this.graph = new Graph(graphConfig);
    this.addPortWithoutEdge();
  }

  startDrag(e: MouseEvent): void {
    const target = e.currentTarget as HTMLElement;
    const label = target.getAttribute('data-label') as HeroType;
    const base64 = this.Heros.get(label);
    const portItems: Array<{
      group: 'in' | 'out'; // 桩的入口或出口
    }> = [];
    if (label === 'Timor') {
      portItems.push({ group: 'out' });
    } else if (label === 'Morgana') {
      portItems.push({ group: 'in' }, { group: 'out' });
    } else if (label === 'Jinx') {
      portItems.push({ group: 'in' });
    }
    const data = {
      size: { width: 65, height: 65 },
      shape: 'html',
      data: { label },
      html: {
        render(node: Cell): HTMLDivElement {
          const wrap = document.createElement('div');
          wrap.className = 'LOL-hero';
          wrap.innerHTML = `
            <img src="${base64}" />
          `;
          return wrap;
        }
      },
      ports: {
        // 连接节点分组, 定义好入口和出口样式
        groups: {
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
        },
        items: portItems
      }
    };
    const node = this.graph.createNode(data);
    this.dnd.start(node, e);
  }

  send(): void {
    this.appService.subject$.next();
  }

  
  addAngularComponent(): void {
    Graph.registerAngularContent('demo-component', { injector: this.injector, content: NodeComponent });
    const node = this.graph.addNode({
      data: {
        ngArguments: {
          title: 'Angular Component',
        }
      },
      x: 40,
      y: 40,
      width: 160,
      height: 30,
      shape: 'angular-shape',
      componentName: 'demo-component'
    });

    // 使用setData更新Angular Component中的属性
    setTimeout(() => {
      node.setData({
        ngArguments: {
          title: 'Update Component'
        }
      });
    }, 1000);
  }

  addAngularTemplate(): void {
    Graph.registerAngularContent('demo-template', { injector: this.injector, content: this.demoTpl });
    this.graph.addNode({
      data: {
        ngArguments: {
          title: 'Angular Template'
        }
      },
      x: 240,
      y: 40,
      width: 160,
      height: 30,
      shape: 'angular-shape',
      componentName: 'demo-template'
    });
  }

  addAngularWithCallback(): void {
    Graph.registerAngularContent('demo-template-callback', _node => {
      return { injector: this.injector, content: this.demoTpl };
    });
    this.graph.addNode({
      data: {
        ngArguments: {
          title: 'Angular Callback'
        }
      },
      x: 440,
      y: 40,
      width: 160,
      height: 30,
      shape: 'angular-shape',
      componentName: 'demo-template-callback'
    });
  }

  // 不用care这个函数, 这是演示一个bug用的
  showBug(): void {
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
    const data1 = {
      shape: 'html', // 必须指定为html
      x: 100,
      y: 250,
      size: { width: 145, height: 48 },
      html: {
        // 节点内容, 使用HTML进行渲染
        render(node: Cell): HTMLDivElement {
          const wrap = document.createElement('div');
          wrap.className = 'dataset-node-container normal';
          wrap.innerHTML = `
            <span class="node-name">连接节点</span>
          `;
          wrap.title = '连接节点';
          return wrap;
        },
        // 控制节点重新渲染
        shouldComponentUpdate(node: Cell): boolean {
          return node.hasChanged('data');
        }
      },
      ports: {
        groups,
        items: [{ group: 'out' }]
      }
    };
    const data2 = {
      shape: 'html', // 必须指定为html
      x: 300,
      y: 250,
      size: { width: 145, height: 48 },
      html: {
        // 节点内容, 使用HTML进行渲染
        render(node: Cell): HTMLDivElement {
          const wrap = document.createElement('div');
          wrap.className = 'dataset-node-container normal';
          wrap.innerHTML = `
            <span class="node-name">输出</span>
          `;
          wrap.title = '输出';
          return wrap;
        },
        // 控制节点重新渲染
        shouldComponentUpdate(node: Cell): boolean {
          return node.hasChanged('data');
        }
      },
      ports: {
        groups,
        items: [{ group: 'in' }]
      }
    };
    const cell1 = this.graph.createNode(data1);
    const cell2 = this.graph.createNode(data2);
    this.graph.addCell(cell1);
    this.graph.addCell(cell2);
    const data = this.graph.toJSON();
    const node1Data = data.cells[0];
    const node2Data = data.cells[1];
    const edgeData = {
      source: { cell: node1Data.id, port: node1Data.ports.items[0].id },
      target: { cell: node2Data.id, port: node2Data.ports.items[0].id }
    };
    const edge = new Shape.Edge(edgeData);
    this.graph.addCell(edge);
    console.log(this.graph.toJSON(), `this.graph.toJSON()`);
  }

  private initGraph(): void {
    const graphConfig = {
      ...this.graphBasicConfig,
      container: this.container.nativeElement
    };
    this.graph = new Graph(graphConfig);

    this.graph.on('node:mouseenter', (args: { node: HTML }) => {
      args.node.addTools({
        name: 'button-remove', // x6 自带的tool类型
        // 覆盖删除按钮自带的配置
        args: {
          markup: [
            {
              tagName: 'circle',
              selector: 'button',
              attrs: {
                r: 8,
                fill: '#ACB3BD',
                cursor: 'pointer'
              }
            },
            {
              tagName: 'path',
              selector: 'icon',
              attrs: {
                d: 'M -3 -3 3 3 M -3 3 3 -3',
                fill: '#fff',
                'stroke-width': 2,
                'pointer-events': 'none'
              }
            }
          ],
          x: '100%',
          onClick({ view, btn }: unknown): void {
            btn.parent.remove();
            view.cell.remove({ ui: true, toolId: btn.cid });
          }
        }
      });
    });
    this.graph.on('node:mouseleave', (args: { node: HTML }) => {
      args.node.removeTools();
    });
  }

  constructor(private appService: AppService, private injector: Injector) {}

  // 必须是在这个钩子中初始化
  ngAfterViewInit(): void {
    this.initGraph();
  }
}
