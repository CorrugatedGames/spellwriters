import { Component, Input } from '@angular/core';

@Component({
  selector: 'sw-phase-banner',
  template: `
    <div class="banner">
      {{ text }}
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

    font-family: FancyText, sans-serif;
    font-size: 3rem;
    color: var(--phase-banner-foreground);
    letter-spacing: 2px;
    font-weight: bold;

    z-index: 10000;

    display: flex;
    justify-content: center;
    align-items: center;

    background: var(--phase-banner-background);
    border-top: 2px solid var(--phase-banner-foreground);
    border-bottom: 2px solid var(--phase-banner-foreground);
  }
  `,
})
export class PhaseBannerComponent {
  @Input({ required: true }) public text = '';
}
