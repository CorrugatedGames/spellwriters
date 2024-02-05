import { Injectable } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';
import {
  aiPatternData,
  characterData,
  elementData,
  elementKeyIds,
  modData,
  spellData,
  spellPatternData,
  spellTagData,
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
    await this.loadModByName('core');
    await this.loadModByName('default');
  }

  async loadModByName(name: string) {
    const mod = await fetch(`assets/mods/${name}/content.json`);
    const modContent = await mod.json();

    await this.loadMod(modContent);
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
        ...Object.values(mod.characters ?? {}).reduce(
          (acc, character) => ({ ...acc, [character.id]: character }),
          {},
        ),
      };
    });

    spellData.update((existingHash) => {
      return {
        ...existingHash,
        ...Object.values(mod.spells ?? {}).reduce(
          (acc, spell) => ({ ...acc, [spell.id]: spell }),
          {},
        ),
      };
    });

    elementData.update((existingHash) => {
      return {
        ...existingHash,
        ...Object.values(mod.elements ?? {}).reduce(
          (acc, element) => ({ ...acc, [element.id]: element }),
          {},
        ),
      };
    });

    elementKeyIds.update((existingHash) => {
      return {
        ...existingHash,
        ...Object.values(mod.elements ?? {}).reduce(
          (acc, element) => ({ ...acc, [element.key]: element.id }),
          {},
        ),
      };
    });

    spellPatternData.update((existingHash) => {
      return {
        ...existingHash,
        ...Object.values(mod.spellPatterns ?? {}).reduce(
          (acc, pattern) => ({ ...acc, [pattern.id]: pattern }),
          {},
        ),
      };
    });

    spellTagData.update((existingHash) => {
      return {
        ...existingHash,
        ...Object.values(mod.spellTags ?? {}).reduce(
          (acc, tag) => ({ ...acc, [tag.id]: tag }),
          {},
        ),
      };
    });

    aiPatternData.update((existingHash) => {
      return {
        ...existingHash,
        ...Object.values(mod.aiPatterns ?? {}).reduce(
          (acc, pattern) => ({ ...acc, [pattern.id]: pattern }),
          {},
        ),
      };
    });

    mod.preload?.svgs?.forEach((svg) => {
      this.iconReg
        .loadSvg(`assets/mods/${mod.name}/${svg.name}.svg`, svg.name)
        ?.subscribe();

      document.documentElement.style.setProperty(`--${svg.name}`, svg.color);
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
  // #endregion

  // #region Basic Content Iterators
  public allStats(): SpellStat[] {
    return Object.values(SpellStat);
  }
  // #endregion
}
