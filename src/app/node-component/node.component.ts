import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-node',
  template: `<div>{{ title }}</div>`
})
export class NodeComponent {
  @Input() title: string;
}
