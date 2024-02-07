import { Component, computed, input } from '@angular/core';
import { getRarityById } from '../../../helpers/lookup/rarities';
import { Relic } from '../../../interfaces';

@Component({
  selector: 'sw-relic-card',
  templateUrl: './relic-card.component.html',
  styleUrl: './relic-card.component.scss',
})
export class RelicCardComponent {
  public relic = input.required<Relic>();
  public stacks = input<number>(0);

  public rarity = computed(() => getRarityById(this.relic().rarity)?.key);

  public get formattedDescription() {
    return this.relic().description;
  }
}
