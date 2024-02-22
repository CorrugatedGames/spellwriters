import { Component, input } from '@angular/core';
import { type StatusEffect } from '../../../interfaces';

@Component({
  selector: 'sw-status-effect-card',
  templateUrl: './status-effect-card.component.html',
  styleUrl: './status-effect-card.component.scss',
})
export class StatusEffectCardComponent {
  public statusEffect = input.required<StatusEffect>();
  public stacks = input<number>(0);

  public get formattedDescription() {
    return this.statusEffect().description;
  }
}
