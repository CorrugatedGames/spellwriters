import { Component, Input } from '@angular/core';

@Component({
  selector: 'sw-mana-bar',
  template: `
    <div class="mana">
      @for(manaIdx of manaArray(maxMana); track manaIdx) {
      <div
        class="mana-orb"
        [class.active]="mana > manaIdx"
        [class.glowing]="glowing"
      ></div>
      }
    </div>
  `,
  styles: `
    .mana {
      display: flex;
      flex-direction: row;

      .mana-orb {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 4px solid #2ba3d3;
        background-color: #132c25;
        position: relative;
        z-index: 1;
        background: var(--mana-color-inactive);
        margin: 4px;

        &::before {
          position: absolute;
          content: '';
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          border-radius: 50%;
          background: var(--mana-color-active);
          z-index: -1;
          transition: opacity 0.5s linear;
          opacity: 0;
        }

        &.active::before {
          opacity: 1;
        }

        &.glowing {
          animation: glow 1s infinite alternate;
        }
      }
    }
  `,
})
export class ManaBarComponent {
  @Input({ required: true }) public mana!: number;
  @Input({ required: true }) public maxMana!: number;
  @Input() glowing = false;

  public manaArray(n: number): number[] {
    return [...Array(n).keys()];
  }
}
