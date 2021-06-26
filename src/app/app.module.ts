import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { NodeComponent } from './node-component/node.component';

@NgModule({
  declarations: [AppComponent, NodeComponent],
  imports: [BrowserModule, CommonModule],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule {}
