import { Component, computed, input } from '@angular/core';
import { getRarityById } from '../../../helpers/lookup/rarities';
import type { Spell } from '../../../interfaces';

@Component({
  selector: 'sw-spell-indicator',
  templateUrl: './spell-indicator.component.html',
  styleUrl: './spell-indicator.component.scss',
})
export class SpellIndicatorComponent {
  public spell = input.required<Spell>();

  public rarity = computed(() => getRarityById(this.spell().rarity)?.key);
}
