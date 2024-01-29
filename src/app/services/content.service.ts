import { Injectable } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';
import {
  characterData,
  elementData,
  elementKeyIds,
  getCharacterById,
  getElementById,
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
    await this.loadCoreSVGs();

    const defaultMod = await fetch('assets/mods/default/content.json');
    const defaultModContent = await defaultMod.json();

    await this.loadMod(defaultModContent);
  }

  async loadCoreSVGs() {
    const statSvgs = [...Object.values(SpellStat).map((el) => `stat-${el}`)];

    this.iconReg
      .loadSvg('assets/mods/core/core-spellwriters.svg', 'core-spellwriters')
      ?.subscribe();

    this.iconReg
      .loadSvg('assets/mods/core/play-nextturn.svg', 'play-nextturn')
      ?.subscribe();

    statSvgs.forEach((svg) =>
      this.iconReg
        .loadSvg(
          `assets/mods/core/${svg.toLowerCase()}.svg`,
          `${svg.toLowerCase()}`,
        )
        ?.subscribe(),
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

    elementData.update((existingHash) => {
      return {
        ...existingHash,
        ...Object.values(mod.elements).reduce(
          (acc, element) => ({ ...acc, [element.id]: element }),
          {},
        ),
      };
    });

    elementKeyIds.update((existingHash) => {
      return {
        ...existingHash,
        ...Object.values(mod.elements).reduce(
          (acc, element) => ({ ...acc, [element.key]: element.id }),
          {},
        ),
      };
    });

    Object.values(mod.elements).forEach((element) => {
      document.documentElement.style.setProperty(
        `--element-${element.key}`,
        element.color,
      );
    });

    mod.preload.svgs.forEach((svg) => {
      this.iconReg
        .loadSvg(`assets/mods/${mod.name}/${svg}.svg`, svg)
        ?.subscribe();
    });
  }

  // #region Content Getters
  public allCharacters(): Character[] {
    return Object.values(characterData());
  }

  public allElements(): SpellElement[] {
    return Object.values(elementData());
  }

  public allSpells(): Spell[] {
    return Object.values(spellData());
  }

  public getCharacter(id: string): Character | undefined {
    return getCharacterById(id);
  }

  public getElement(id: string): SpellElement | undefined {
    return getElementById(id);
  }

  public getSpell(id: string): Spell | undefined {
    return getSpellById(id);
  }
  // #endregion

  // #region Basic Content Iterators
  public allStats(): SpellStat[] {
    return Object.values(SpellStat);
  }
  // #endregion
}
