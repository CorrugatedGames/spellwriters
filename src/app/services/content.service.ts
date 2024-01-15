import { Injectable } from '@angular/core';
import { Character, ContentMod, Spell } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private _allMods: Record<string, ContentMod> = {};

  private _allCharacters: Record<string, Character> = {};
  private _allSpells: Record<string, Spell> = {};

  constructor() {}

  async init() {
    const defaultMod = await fetch('assets/mods/default/content.json');
    const defaultModContent = await defaultMod.json();

    this.loadMod(defaultModContent);
  }

  loadMod(mod: ContentMod) {
    this._allMods[mod.name] = mod;

    Object.values(mod.characters).forEach((character) => {
      this._allCharacters[character.name] = character;
    });

    Object.values(mod.spells).forEach((spell) => {
      this._allSpells[spell.name] = spell;
    });
  }

  public allCharacters(): Character[] {
    return Object.values(this._allCharacters);
  }

  public allSpells(): Spell[] {
    return Object.values(this._allSpells);
  }

  public getCharacter(id: string): Character {
    return this._allCharacters[id];
  }

  public getSpell(id: string): Spell {
    return this._allSpells[id];
  }
}
