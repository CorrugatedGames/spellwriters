import { Component, computed, input } from '@angular/core';
import { getRarityById } from '../../../helpers/lookup/rarities';
import { type Relic } from '../../../interfaces';

@Component({
  selector: 'sw-relic-indicator',
  templateUrl: './relic-indicator.component.html',
  styleUrl: './relic-indicator.component.scss',
})
export class RelicIndicatorComponent {
  public relic = input.required<Relic>();
  public stacks = input<number>(0);

  public rarity = computed(() => getRarityById(this.relic().rarity)?.key);
}
