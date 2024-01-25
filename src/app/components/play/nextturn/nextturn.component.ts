import { Component, EventEmitter, Output, input } from '@angular/core';

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
  styles: `
  
  .icon-container {
    cursor: pointer;

    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 1px solid #fff;
    background-color: #133042;

    display: flex;
    justify-content: center;
    align-items: center;

    &.glowing {
      animation: glow 1s infinite alternate;
    }

    &.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  `,
})
export class NextTurnComponent {
  isDisabled = input<boolean>(false);
  isGlowing = input<boolean>(false);
  @Output() nextTurn = new EventEmitter<void>();

  doNextTurn() {
    if (this.isDisabled()) return;
    this.nextTurn.emit();
  }
}
