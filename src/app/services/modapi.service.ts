import { Injectable } from '@angular/core';
import { AllHelpers } from '../helpers';

@Injectable({
  providedIn: 'root',
})
export class ModAPIService {
  constructor() {}

  init() {
    window.api = Object.assign({}, AllHelpers) as typeof AllHelpers;
  }
}
