import { Component, EventEmitter, Output, input } from '@angular/core';

@Component({
  selector: 'sw-extradraw',
  template: `
    <div
      class="icon-container"
      [class.disabled]="isDisabled()"
      (click)="doExtraDraw()"
      (keyup.enter)="doExtraDraw()"
      tabindex="0"
    >
      <sw-icon category="play" name="extradraw" [size]="48"></sw-icon>
    </div>
  `,
  styleUrls: ['./extradraw.component.scss'],
})
export class ExtraDrawComponent {
  isDisabled = input<boolean>(false);
  @Output() extraDraw = new EventEmitter<void>();

  doExtraDraw() {
    if (this.isDisabled()) return;
    this.extraDraw.emit();
  }
}
