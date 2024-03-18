import { Component, input, output } from '@angular/core';

@Component({
  selector: 'sw-pausegame',
  template: `
    <div
      class="icon-container"
      [class.disabled]="isDisabled()"
      (click)="doPauseGame()"
      (keyup.enter)="doPauseGame()"
      tabindex="0"
    >
      <sw-icon category="play" name="pausegame" [size]="48"></sw-icon>
    </div>
  `,
  styleUrls: ['./pausegame.component.scss'],
})
export class PauseGameComponent {
  isDisabled = input<boolean>(false);
  pauseGame = output<void>();

  doPauseGame() {
    if (this.isDisabled()) return;
    this.pauseGame.emit();
  }
}
