import { Injectable } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';
import {
  Character,
  ContentMod,
  Spell,
  SpellElement,
  SpellStat,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private _allMods: Record<string, ContentMod> = {};

  private _allCharacters: Record<string, Character> = {};
  private _allSpells: Record<string, Spell> = {};

  constructor(private iconReg: SvgIconRegistryService) {}

  async init() {
    await this.loadSVGs();

    const defaultMod = await fetch('assets/mods/default/content.json');
    const defaultModContent = await defaultMod.json();

    await this.loadMod(defaultModContent);
  }

  async loadSVGs() {
    const svgs = [
      ...Object.values(SpellElement).map((el) => `element-${el}`),
      ...Object.values(SpellStat).map((el) => `stat-${el}`),
    ];

    svgs.forEach((svg) =>
      this.iconReg.loadSvg(`assets/icon/${svg.toLowerCase()}.svg`)?.subscribe(),
    );
  }

  async loadMod(mod: ContentMod) {
    this._allMods[mod.name] = mod;

    Object.values(mod.characters).forEach((character) => {
      this._allCharacters[character.id] = character;
    });

    Object.values(mod.spells).forEach((spell) => {
      this._allSpells[spell.id] = spell;
    });
  }

  // #region Content Getters
  public allCharacters(): Character[] {
    return Object.values(this._allCharacters);
  }

  public allSpells(): Spell[] {
    return Object.values(this._allSpells);
  }

  public getCharacter(id: string): Character | undefined {
    return this._allCharacters[id];
  }

  public getSpell(id: string): Spell | undefined {
    return this._allSpells[id];
  }
  // #endregion

  // #region Basic Content Iterators
  public allElements(): SpellElement[] {
    return Object.values(SpellElement);
  }

  public allStats(): SpellStat[] {
    return Object.values(SpellStat);
  }
  // #endregion
}
