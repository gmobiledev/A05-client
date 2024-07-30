// c.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class GSubService {
  taskSub: Subject<any> = new Subject();
  taskObservable = this.taskSub.asObservable();
}