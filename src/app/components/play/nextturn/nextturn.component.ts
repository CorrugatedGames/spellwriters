import { Component, input, output } from '@angular/core';

@Component({
  selector: 'sw-nextturn',
  template: `
    <div
      class="icon-container"
      [class.disabled]="isDisabled()"
      [class.glowing]="isGlowing() && !isDisabled()"
      (click)="doNextTurn()"
      (keyup.enter)="doNextTurn()"
      tabindex="0"
    >
      <sw-icon category="play" name="nextturn" [size]="48"></sw-icon>
    </div>
  `,
  styleUrls: ['./nextturn.component.scss'],
})
export class NextTurnComponent {
  isDisabled = input<boolean>(false);
  isGlowing = input<boolean>(false);
  nextTurn = output<void>();

  doNextTurn() {
    if (this.isDisabled()) return;
    this.nextTurn.emit();
  }
}
