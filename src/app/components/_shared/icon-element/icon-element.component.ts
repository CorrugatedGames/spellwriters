import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { getElementKey } from '../../../helpers';

@Component({
  selector: 'sw-icon-element',
  template: `
    <sw-icon category="element" [name]="elementName" [size]="size()"></sw-icon>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconElementComponent {
  public element = input.required<string>();
  public size = input<number>(24);

  public get elementName() {
    return getElementKey(this.element()) ?? '';
  }
}
