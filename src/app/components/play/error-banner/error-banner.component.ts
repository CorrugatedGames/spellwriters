import { Component, input } from '@angular/core';

@Component({
  selector: 'sw-error-banner',
  template: `
    <span class="badge text-bg-danger">{{ text() }}</span>
  `,
  styles: `
    .badge {
      font-size: 1.25rem;
    }
  `,
})
export class ErrorBannerComponent {
  public text = input.required<string>();
}
