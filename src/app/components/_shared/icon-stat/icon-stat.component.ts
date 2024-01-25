import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SpellStat } from '../../../interfaces';

@Component({
  selector: 'sw-icon-stat',
  template: `
    <sw-icon category="stat" [name]="statName" [size]="size()"></sw-icon>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconStatComponent {
  public stat = input.required<SpellStat>();
  public size = input<number>(24);

  public get statName() {
    return this.stat().toLowerCase();
  }
}
