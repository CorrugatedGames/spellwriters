import { Injectable } from '@angular/core';
import { LocalStorage } from 'ngx-webstorage';

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
}
