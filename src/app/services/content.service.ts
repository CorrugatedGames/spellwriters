import { Injectable } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';
import {
  characterData,
  getCharacterById,
  getSpellById,
  modData,
  spellData,
} from '../helpers';
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
    modData.update((existingHash) => {
      return {
        ...existingHash,
        [mod.name]: mod,
      };
    });

    characterData.update((existingHash) => {
      return {
        ...existingHash,
        ...Object.values(mod.characters).reduce(
          (acc, character) => ({ ...acc, [character.id]: character }),
          {},
        ),
      };
    });

    spellData.update((existingHash) => {
      return {
        ...existingHash,
        ...Object.values(mod.spells).reduce(
          (acc, spell) => ({ ...acc, [spell.id]: spell }),
          {},
        ),
      };
    });
  }

  // #region Content Getters
  public allCharacters(): Character[] {
    return Object.values(characterData());
  }

  public allSpells(): Spell[] {
    return Object.values(spellData());
  }

  public getCharacter(id: string): Character | undefined {
    return getCharacterById(id);
  }

  public getSpell(id: string): Spell | undefined {
    return getSpellById(id);
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
