import { Component, inject } from '@angular/core';
import { DebugService } from '../../../services/debug.service';

@Component({
  selector: 'sw-debug-panel',
  templateUrl: './debug-panel.component.html',
  styleUrl: './debug-panel.component.scss',
})
export class DebugPanelComponent {
  public debugService = inject(DebugService);

  public get api() {
    return window.api;
  }
}
