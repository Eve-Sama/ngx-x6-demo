import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AddNodeComponent } from './add-node/add-node.component';
import { InitGraphComponent } from './init-graph/init-graph.component';

@NgModule({
  declarations: [
    AppComponent,
    AddNodeComponent,
    InitGraphComponent
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
