import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class AppService {
  subject$ = new Subject();
}
