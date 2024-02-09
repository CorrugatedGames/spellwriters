import { Injectable } from '@angular/core';

import * as Helpers from '../helpers';

@Injectable({
  providedIn: 'root',
})
export class ModAPIService {
  constructor() {}

  init() {
    (window as any).modAPI = {};

    Object.keys(Helpers).forEach((helperFnKey) => {
      (window as any).modAPI[helperFnKey] = (Helpers as any)[helperFnKey];
    });
  }
}
