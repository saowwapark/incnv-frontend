import { Injectable } from '@angular/core';

@Injectable()
export class ConstantsService {
  // change from http://localhost:3000 to /
  // readonly baseAppUrl: string = '';
  readonly baseAppUrl: string = 'http://localhost:3000';
}
