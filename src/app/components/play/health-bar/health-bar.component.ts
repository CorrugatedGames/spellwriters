import { Component, Input } from '@angular/core';

@Component({
  selector: 'sw-health-bar',
  template: `
    <ngb-progressbar
      type="health"
      [value]="health"
      [max]="maxHealth"
      [animated]="true"
      height="24px"
    >
      <strong class="health-text" *ngIf="showHealth && health < 3">
        {{ health }}
      </strong>

      <strong class="health-text" *ngIf="showHealth && health >= 3">
        {{ health }} / {{ maxHealth }}
      </strong>
    </ngb-progressbar>
  `,
  styles: `
  .health-text {
    align-self: center;
  }
  `,
})
export class HealthBarComponent {
  @Input({ required: true }) public health!: number;
  @Input({ required: true }) public maxHealth!: number;
  @Input() public showHealth = false;
}
