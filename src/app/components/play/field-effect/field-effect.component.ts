import { Component, input } from '@angular/core';
import { FieldEffect } from '../../../interfaces';

@Component({
  selector: 'sw-field-effect',
  template: `
    <sw-icon
      category="field-effect"
      [name]="effect().effect"
      [size]="64"
    ></sw-icon>
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
export class FieldEffectComponent {
  public effect = input.required<FieldEffect>();
}
