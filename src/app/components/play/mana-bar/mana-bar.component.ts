import { Component, Input } from '@angular/core';

@Component({
  selector: 'sw-mana-bar',
  template: `
    <div class="mana">
      @for(manaIdx of manaArray(maxMana); track manaIdx) {
      <div
        class="mana-orb"
        [class.active]="shouldBeActive(manaIdx)"
        [class.glowing]="shouldBeGlowing(manaIdx)"
        [class.spending]="shouldBeSpending(manaIdx)"
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

        &.spending::before {
          background: var(--mana-color-spending);
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
  @Input() isGlowing = false;
  @Input() spending = 0;

  public manaArray(n: number): number[] {
    return [...Array(n).keys()];
  }

  shouldBeActive(manaIdx: number) {
    return this.mana > manaIdx;
  }

  shouldBeGlowing(manaIdx: number) {
    return (
      (this.isGlowing && this.mana > manaIdx) || this.shouldBeSpending(manaIdx)
    );
  }

  shouldBeSpending(manaIdx: number) {
    return (
      this.spending > 0 &&
      this.shouldBeActive(manaIdx) &&
      manaIdx >= this.mana - this.spending
    );
  }
}
