import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SpellStat } from '../../../interfaces';

@Component({
  selector: 'sw-icon-stat',
  template: `
    <sw-icon category="stat" [name]="statName" [size]="size"></sw-icon>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconStatComponent {
  @Input({ required: true }) public stat!: SpellStat;
  @Input() size = 24;

  public get statName() {
    return this.stat.toLowerCase();
  }
}
