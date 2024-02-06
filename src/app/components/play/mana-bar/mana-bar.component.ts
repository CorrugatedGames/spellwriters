import { Component, input } from '@angular/core';

@Component({
  selector: 'sw-mana-bar',
  template: `
    <div class="mana">
      @for(manaIdx of manaArray(maxMana()); track manaIdx) {
      <div
        class="mana-orb"
        [class.active]="shouldBeActive(manaIdx)"
        [class.glowing]="shouldBeGlowing(manaIdx)"
        [class.spending]="shouldBeSpending(manaIdx)"
      ></div>
      }
    </div>
  `,
  styleUrls: ['./mana-bar.component.scss'],
})
export class ManaBarComponent {
  public mana = input.required<number>();
  public maxMana = input.required<number>();
  public isGlowing = input<boolean>(false);
  public spending = input<number>(0);

  public manaArray(n: number): number[] {
    return [...Array(n).keys()];
  }

  shouldBeActive(manaIdx: number) {
    return this.mana() > manaIdx;
  }

  shouldBeGlowing(manaIdx: number) {
    return (
      (this.isGlowing() && this.mana() > manaIdx) ||
      this.shouldBeSpending(manaIdx)
    );
  }

  shouldBeSpending(manaIdx: number) {
    return (
      this.spending() > 0 &&
      this.shouldBeActive(manaIdx) &&
      manaIdx >= this.mana() - this.spending()
    );
  }
}
