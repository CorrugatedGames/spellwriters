import { Component, input } from '@angular/core';
import { type FieldStatus } from '../../../interfaces';

@Component({
  selector: 'sw-field-status',
  template: `
    <sw-sprite [spritable]="status()" [size]="92"></sw-sprite>
  `,
  styles: `
    :host {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `,
})
export class FieldStatusComponent {
  public status = input.required<FieldStatus>();
}
