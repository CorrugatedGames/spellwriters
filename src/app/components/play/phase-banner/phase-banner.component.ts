import { Component, input } from '@angular/core';

@Component({
  selector: 'sw-phase-banner',
  template: `
    <div class="banner">
      <div class="banner-text">
        {{ text() }}
      </div>

      <div class="banner-actions">
        <button
          class="btn banner-action"
          [swHoverClass]="'hovering'"
          *ngFor="let action of actions()"
          (click)="action.action()"
        >
          {{ action.text }}
        </button>
      </div>
    </div>
  `,
  styles: `

  :host {
    height: 100%;
    width: 100%;
    display: block;
  }
  
  .banner {
    height: 100%;
    width: 100%;

    user-select: none;

    z-index: 10000;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: var(--phase-banner-background);
    border-top: 2px solid var(--phase-banner-foreground);
    border-bottom: 2px solid var(--phase-banner-foreground);

    .banner-text {
      font-family: FancyText, sans-serif;
      font-size: 3rem;
      color: var(--phase-banner-foreground);
      letter-spacing: 2px;
      font-weight: bold;
    }

    .banner-actions {
      .banner-action {
        color: var(--phase-banner-action-background);
        border-color: var(--phase-banner-action-background);

        &.hovering {
          background: var(--phase-banner-action-background);
          color: var(--phase-banner-action-foreground);
        }

        &:not(:first-child) {
          margin-left: 1rem;
        }
      }
    }
  }
  `,
})
export class PhaseBannerComponent {
  public text = input.required<string>();
  public actions = input<Array<{ text: string; action: () => void }>>([]);
}
