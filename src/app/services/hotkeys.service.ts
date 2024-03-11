import { Injectable, inject } from '@angular/core';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { DebugService } from './debug.service';

enum ActionType {
  OpenDebug = 'OpenDebug',
}

const hotkeysMap: Record<string, ActionType> = {
  'ctrl+shift+x': ActionType.OpenDebug,
};

@Injectable({
  providedIn: 'root',
})
export class KeymapService {
  private debugService = inject(DebugService);
  private hotkeysService = inject(HotkeysService);

  private actionMap: Record<ActionType, () => void> = {
    [ActionType.OpenDebug]: () => {
      this.debugService.toggleDebugPanel();
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
