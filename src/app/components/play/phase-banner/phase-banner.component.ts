import { Component, input } from '@angular/core';

@Component({
  selector: 'sw-phase-banner',
  template: `
    <div class="banner">
      <div class="banner-text">
        {{ text() }}
      </div>

      <div class="banner-actions">
        @for(action of actions(); track $index) {
        <button
          class="btn btn-untextured banner-action"
          [swHoverClass]="'hovering'"
          (click)="action.action()"
        >
          {{ action.text }}
        </button>
        }
      </div>
    </div>
  `,
  styleUrls: ['./phase-banner.component.scss'],
})
export class PhaseBannerComponent {
  public text = input.required<string>();
  public actions = input<Array<{ text: string; action: () => void }>>([]);
}
