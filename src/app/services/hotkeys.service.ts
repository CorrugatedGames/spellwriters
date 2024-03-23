import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { DebugService } from './debug.service';

enum ActionType {
  OpenDebug = 'OpenDebug',
  NavigateTestRunner = 'NavigateTestRunner',
  NavigateDebugComponents = 'NavigateDebugComponents',
}

const hotkeysMap: Record<string, ActionType> = {
  'ctrl+shift+x': ActionType.OpenDebug,
  'ctrl+shift+d': ActionType.NavigateTestRunner,
  'ctrl+shift+c': ActionType.NavigateDebugComponents,
};

@Injectable({
  providedIn: 'root',
})
export class KeymapService {
  private router = inject(Router);
  private debugService = inject(DebugService);
  private hotkeysService = inject(HotkeysService);

  private actionMap: Record<ActionType, () => void> = {
    [ActionType.OpenDebug]: () => {
      this.debugService.toggleDebugPanel();
    },
    [ActionType.NavigateTestRunner]: () => {
      this.router.navigate(['/debug/test-run']);
    },
    [ActionType.NavigateDebugComponents]: () => {
      this.router.navigate(['/debug/components']);
    },
  };

  constructor() {}

  init() {
    Object.keys(hotkeysMap).forEach((hotkey) => {
      const handler = this.actionMap[hotkeysMap[hotkey]];
      if (!handler) return;

      this.hotkeysService.add(
        new Hotkey(hotkey, (e: KeyboardEvent) => {
          e.preventDefault();
          handler();
          return false;
        }),
      );
    });
  }
}
