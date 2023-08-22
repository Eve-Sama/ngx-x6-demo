import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-node',
  template: `<div>{{ title }}</div>`
})
export class NodeComponent implements OnChanges {
  @Input() title: string;

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes, `changes`);
  }
}
