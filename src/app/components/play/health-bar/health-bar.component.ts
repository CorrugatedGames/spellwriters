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
      <strong *ngIf="showHealth">{{ health }} / {{ maxHealth }}</strong>
    </ngb-progressbar>
  `,
  styles: ``,
})
export class HealthBarComponent {
  @Input({ required: true }) public health!: number;
  @Input({ required: true }) public maxHealth!: number;
  @Input() public showHealth = false;
}
