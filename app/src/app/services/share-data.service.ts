import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {

//   private dataShared = new BehaviorSubject<string>('');
//   private resetTrigger = new Subject<void>();

//   sendData(data: any) {
//     this.dataShared.next(data);
//     this.resetTrigger.next(); // Disparar el reinicio del BehaviorSubject
//   }

//   getData() {
//     return this.dataShared.asObservable();
//   }

//   resetData() {
//     this.dataShared = new BehaviorSubject<string>('');
//   }

//   getResetTrigger() {
//     return this.resetTrigger.asObservable();
//   }
private sharedValueSubject = new BehaviorSubject<number>(0);

  setSharedValue(value: number) {
    this.sharedValueSubject.next(value);
  }

  getSharedValue() {
    return this.sharedValueSubject.asObservable();
  }
}
