import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Spell } from '../../../interfaces';

@Component({
  selector: 'sw-spell-card',
  templateUrl: './spell-card.component.html',
  styleUrl: './spell-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpellCardComponent {
  @Input({ required: true }) public spell!: Spell;
}
