import { Component, input } from '@angular/core';
import { FieldElement } from '../../../interfaces';

@Component({
  selector: 'sw-field-element',
  template: `
    <sw-icon category="element" [name]="element().key" [size]="64"></sw-icon>
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
export class FieldElementComponent {
  public element = input.required<FieldElement>();
}
