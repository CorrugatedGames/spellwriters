import { Injectable } from '@angular/core';

import * as Helpers from '../helpers';

@Injectable({
  providedIn: 'root',
})
export class ModAPIService {
  constructor() {}

  init() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).api = {};

    Object.keys(Helpers).forEach((helperFnKey) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).api[helperFnKey] = (Helpers as any)[helperFnKey];
    });
  }
}
