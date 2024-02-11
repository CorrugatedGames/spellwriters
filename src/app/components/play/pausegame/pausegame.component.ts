import { Component, EventEmitter, Output, input } from '@angular/core';

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
  @Output() pauseGame = new EventEmitter<void>();

  doPauseGame() {
    if (this.isDisabled()) return;
    this.pauseGame.emit();
  }
}
