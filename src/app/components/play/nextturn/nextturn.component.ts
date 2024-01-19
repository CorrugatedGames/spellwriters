import { Component, Input } from '@angular/core';

@Component({
  selector: 'sw-nextturn',
  template: `
    <div class="icon-container" [class.glowing]="glowing">
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
  }
  `,
})
export class NextTurnComponent {
  @Input() glowing = false;
}
