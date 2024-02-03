import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private versionInfo = {
    dirty: false,
    raw: 'v.local',
    hash: 'v.local',
    distance: -1,
    tag: 'v.local',
    semver: '',
    suffix: '',
    semverString: '',
  };

  public get versionString() {
    if (this.versionInfo.distance >= 0 && this.versionInfo.tag) {
      return `${this.versionInfo.tag} (${this.versionInfo.raw})`;
    }

    return (
      this.versionInfo.tag ||
      this.versionInfo.semverString ||
      this.versionInfo.raw ||
      this.versionInfo.hash
    );
  }

  constructor() {}

  async init() {
    try {
      const response = await fetch('assets/version.json');
      const versionInfo = await response.json();
      this.versionInfo = versionInfo;
    } catch (e) {
      console.error('Failed to load version info', e);
    }
  }
}
