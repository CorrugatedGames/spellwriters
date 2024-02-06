import { Component, input } from '@angular/core';

@Component({
  selector: 'sw-health-bar',
  template: `
    <ngb-progressbar
      type="health"
      [value]="health()"
      [max]="maxHealth()"
      [animated]="true"
      height="24px"
    >
      @if(showHealth() && health() < 3) {
      <strong class="health-text">
        {{ health() }}
      </strong>
      } @if(showHealth() && health() >= 3) {
      <strong class="health-text">{{ health() }} / {{ maxHealth() }}</strong>
      }
    </ngb-progressbar>
  `,
  styles: `
  .health-text {
    align-self: center;
    user-select: none;
  }
  `,
})
export class HealthBarComponent {
  public health = input.required<number>();
  public maxHealth = input.required<number>();
  public showHealth = input<boolean>(false);
}
