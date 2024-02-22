import { Component, input } from '@angular/core';
import { type StatusEffect } from '../../../interfaces';

@Component({
  selector: 'sw-status-effect-indicator',
  templateUrl: './status-effect-indicator.component.html',
  styleUrl: './status-effect-indicator.component.scss',
})
export class StatusEffectIndicatorComponent {
  public statusEffect = input.required<StatusEffect>();
  public stacks = input<number>(0);
}
