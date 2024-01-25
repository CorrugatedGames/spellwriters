import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SpellElement } from '../../../interfaces';

@Component({
  selector: 'sw-icon-element',
  template: `
    <sw-icon category="element" [name]="elementName" [size]="size()"></sw-icon>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconElementComponent {
  public element = input.required<SpellElement>();
  public size = input<number>(24);

  public get elementName() {
    return this.element().toLowerCase();
  }
}
