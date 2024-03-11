import { Component } from '@angular/core';

@Component({
  selector: 'sw-root',
  template: `
    <router-outlet></router-outlet>
    <sw-debug-panel></sw-debug-panel>
  `,
  styles: [],
})
export class AppComponent {}
