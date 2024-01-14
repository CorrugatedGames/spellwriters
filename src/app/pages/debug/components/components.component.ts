import { Component } from '@angular/core';

@Component({
  selector: 'sw-components',
  templateUrl: './components.component.html',
  styleUrl: './components.component.scss',
})
export class DebugComponentsComponent {
  public numSpells = Array(261)
    .fill(0)
    .map((_, i) => i);
  public numCharacters = Array(130)
    .fill(0)
    .map((_, i) => i);
}
