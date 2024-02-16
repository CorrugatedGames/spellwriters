import { Injectable, inject } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';
import {
  addAIPatternImpl,
  addElementalCollisionImpl,
  addRelicImpl,
  addSpellImpl,
  addSpellPatternImpl,
  addSpellTagImpl,
  addTileStatusImpl,
  aiPatternData,
  characterData,
  elementData,
  elementKeyIds,
  modData,
  relicData,
  spellData,
  spellPatternData,
  spellTagData,
  tileStatusData,
} from '../helpers';
import { rarityData } from '../helpers/lookup/rarities';
import {
  type AIPatternImpl,
  type ContentItem,
  type ContentMod,
  type ContentType,
  type ElementalCollisionImpl,
  type RitualImpl,
  type SpellPatternImpl,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private iconReg = inject(SvgIconRegistryService);

  private scriptLoaders: Record<
    ContentType,
    (key: string, item: unknown) => void
  > = {
    AIPattern: (lookupKey: string, item: unknown) =>
      addAIPatternImpl(lookupKey, item as AIPatternImpl),

    ElementalCollision: (lookupKey: string, item: unknown) =>
      addElementalCollisionImpl(lookupKey, item as ElementalCollisionImpl),

    Relic: (lookupKey: string, item: unknown) =>
      addRelicImpl(lookupKey, item as RitualImpl),

    Spell: (lookupKey: string, item: unknown) =>
      addSpellImpl(lookupKey, item as RitualImpl),

    SpellTag: (lookupKey: string, item: unknown) =>
      addSpellTagImpl(lookupKey, item as RitualImpl),

    SpellPattern: (lookupKey: string, item: unknown) =>
      addSpellPatternImpl(lookupKey, item as SpellPatternImpl),

    TileStatus: (lookupKey: string, item: unknown) =>
      addTileStatusImpl(lookupKey, item as RitualImpl),
  };

  async init() {
    await this.loadModByName('core');
    await this.loadModByName('default');
  }

  async loadModByName(name: string) {
    try {
      const mod = await fetch(`assets/mods/${name}/content.json`);
      const modContent = await mod.json();

      await this.loadMod(modContent);
    } catch (e) {
      console.error(`Failed to load mod: ${name}`, e);
      throw e;
    }
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

    rarityData.update((existingHash) => {
      return {
        ...existingHash,
        ...Object.values(mod.rarities ?? {}).reduce(
          (acc, rarity) => ({ ...acc, [rarity.id]: rarity }),
          {},
        ),
      };
    });

    relicData.update((existingHash) => {
      return {
        ...existingHash,
        ...Object.values(mod.relics ?? {}).reduce(
          (acc, relic) => ({ ...acc, [relic.id]: relic }),
          {},
        ),
      };
    });

    tileStatusData.update((existingHash) => {
      return {
        ...existingHash,
        ...Object.values(mod.tileStatuses ?? {}).reduce(
          (acc, status) => ({ ...acc, [status.id]: status }),
          {},
        ),
      };
    });

    mod.preload?.svgs?.forEach((svg) => {
      this.iconReg
        .loadSvg(`assets/mods/${mod.name}/${svg.name}.svg`, svg.name)
        ?.subscribe();
    });

    Object.keys(mod.preload?.colors ?? {}).forEach((colorName) => {
      document.documentElement.style.setProperty(
        `--${colorName}`,
        mod.preload?.colors[colorName],
      );
    });

    const allScripts = mod.preload?.scripts ?? [];
    await Promise.all(
      allScripts.map(async (script) => {
        const modScriptData = await import(
          /* @vite-ignore */ `/assets/mods/${mod.name}/${script}`
        );

        console.groupCollapsed(`[Mod] ${mod.name}`);

        Object.keys(modScriptData).forEach((key) => {
          const lookupKey = key;
          const item = modScriptData[key] as ContentItem;

          console.info(`Loading ${item.__contentType} ${lookupKey}`, item);

          this.scriptLoaders[item.__contentType]?.(lookupKey, item);
        });

        console.groupEnd();

        return modScriptData;
      }),
    );
  }
}
