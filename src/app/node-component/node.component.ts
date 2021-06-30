import { Component, OnDestroy, OnInit } from '@angular/core';
import { pipe, Subject } from 'rxjs';
import { AppService } from '../app.service';

@Component({
  selector: 'app-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class NodeComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.appService.subject$.subscribe(()=>{
      console.log(1);
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
