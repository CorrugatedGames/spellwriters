import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SpellElement } from '../../../interfaces';

@Component({
  selector: 'sw-icon-element',
  template: `
    <sw-icon category="element" [name]="elementName" [size]="size"></sw-icon>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconElementComponent {
  @Input({ required: true }) public element!: SpellElement;
  @Input() size = 24;

  public get elementName() {
    return this.element.toLowerCase();
  }
}
