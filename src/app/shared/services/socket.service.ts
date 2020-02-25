// import { Injectable } from '@angular/core';

// import * as socketIo from 'socket.io-client';
// import { Observable } from 'rxjs';
// import { ConstantsService } from './constants.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class SocketService {
//   private socket;

//   baseRouteUrl: string;
//   constructor(private _constant: ConstantsService) {
//     this.baseRouteUrl = `${this._constant.baseAppUrl}`;
//   }

//   public initSocket(): void {
//     this.socket = socketIo(this.baseRouteUrl);
//   }

//   public send(data: any): void {
//     this.socket.emit('data', data);
//   }

//   public onData(): Observable<any> {
//     return new Observable<any>(observer => {
//       this.socket.on('data', (data: any) => observer.next(data));
//     });
//   }

//   public onEvent(event: Event): Observable<any> {
//     return new Observable<Event>(observer => {
//       this.socket.on(event, () => observer.next());
//     });
//   }
// }
