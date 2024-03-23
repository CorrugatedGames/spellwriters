import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-webstorage';
import { gamestate, saveGamestate } from '../helpers';

@Injectable({
  providedIn: 'root',
})
export class DebugService {
  @LocalStorage()
  private debugPanelVisible!: boolean;

  @LocalStorage()
  private debugTilePositionsVisible!: boolean;

  public get isDebugPanelVisible() {
    return this.debugPanelVisible;
  }

  public get isTilePositionsVisible() {
    return this.debugTilePositionsVisible;
  }

  constructor() {}

  toggleDebugPanel() {
    this.debugPanelVisible = !this.debugPanelVisible;
  }

  toggleTilePositions() {
    this.debugTilePositionsVisible = !this.debugTilePositionsVisible;
  }

  exportGameState() {
    const state = gamestate();

    const fileName = `${state.players[0].name}-${state.id}-${Date.now()}.sw`;
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', fileName);
    downloadAnchorNode.click();
  }

  importGameState(e: Event) {
    const files = (e.target as HTMLInputElement)?.files;
    if (!files) {
      return;
    }

    const file = files[0];

    const reader = new FileReader();
    reader.onload = (ev) => {
      const gamestateFile = JSON.parse(
        (ev.target as FileReader).result as string,
      );

      saveGamestate({ state: gamestateFile });

      const finish = () => {
        (e.target as HTMLInputElement).value = '';
      };

      finish();
    };

    reader.readAsText(file);
  }
}
