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
        background: linear-gradient(45deg, #132c25 0%, #090979 35%, #00d4ff 100%);
        margin: 4px;

        &.active {
          background: linear-gradient(45deg, #ffffff 0%, #ffffff 35%, #67d8ee 100%);
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
