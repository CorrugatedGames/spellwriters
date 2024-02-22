import { Injectable, inject, type WritableSignal } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';
import {
  addAIPatternImpl,
  addElementalCollisionImpl,
  addRelicImpl,
  addSpellImpl,
  addSpellPatternImpl,
  addSpellTagImpl,
  addStatusEffectImpl,
  addTileStatusImpl,
  aiPatternData,
  characterData,
  elementData,
  modData,
  relicData,
  spellData,
  spellPatternData,
  spellTagData,
  statusEffectData,
  tileStatusData,
} from '../helpers';
import { rarityData } from '../helpers/lookup/rarities';
import {
  ContentModContentKey,
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

    StatusEffect: (lookupKey: string, item: unknown) =>
      addStatusEffectImpl(lookupKey, item as RitualImpl),

    TileStatus: (lookupKey: string, item: unknown) =>
      addTileStatusImpl(lookupKey, item as RitualImpl),
  };

  private contentSignals: Record<
    ContentModContentKey,
    WritableSignal<unknown>
  > = {
    [ContentModContentKey.AIPattern]: aiPatternData,
    [ContentModContentKey.Character]: characterData,
    [ContentModContentKey.Element]: elementData,
    [ContentModContentKey.Rarity]: rarityData,
    [ContentModContentKey.Relic]: relicData,
    [ContentModContentKey.Spell]: spellData,
    [ContentModContentKey.SpellPattern]: spellPatternData,
    [ContentModContentKey.SpellTag]: spellTagData,
    [ContentModContentKey.StatusEffect]: statusEffectData,
    [ContentModContentKey.TileStatus]: tileStatusData,
  };

  async init() {
    await this.loadModByName('core');
    await this.loadModByName('default');
  }

  async loadModByName(name: string) {
    try {
      console.info(`Loading mod: ${name}`);
      const mod = await fetch(`assets/mods/${name}/content.json`);
      const modContent = await mod.json();

      await this.loadMod(modContent);
    } catch (e) {
      console.error(`Failed to load mod: ${name}`, e);
      throw e;
    }
  }

  async loadMod(mod: ContentMod) {
    console.groupCollapsed(`[Mod] ${mod.name}`);

    modData.update((existingHash) => {
      return {
        ...existingHash,
        [mod.name]: mod,
      };
    });

    console.groupCollapsed('[Content]');
    Object.values(ContentModContentKey).forEach((key) => {
      Object.values(mod[key] ?? {}).forEach((item) => {
        console.info(`[${key}] ${item.name}`, item);
        this.contentSignals[key].update((existingHash) => {
          return {
            ...(existingHash ?? {}),
            [item.id]: item,
          };
        });
      });
    });
    console.groupEnd();

    const svgs = mod.preload?.svgs ?? [];
    if (svgs.length > 0) {
      console.groupCollapsed('[SVG]');
      svgs.forEach((svg) => {
        console.info(svg.name);
        this.iconReg
          .loadSvg(`assets/mods/${mod.name}/${svg.name}.svg`, svg.name)
          ?.subscribe();
      });
      console.groupEnd();
    }

    const colors = Object.keys(mod.preload?.colors ?? {});
    if (colors.length > 0) {
      console.groupCollapsed('[Colors]');
      colors.forEach((colorName) => {
        console.info(colorName, mod.preload?.colors[colorName]);
        document.documentElement.style.setProperty(
          `--${colorName}`,
          mod.preload?.colors[colorName],
        );
      });
      console.groupEnd();
    }

    console.groupCollapsed('[Impl]');
    const allScripts = mod.preload?.scripts ?? [];
    await Promise.all(
      allScripts.map(async (script) => {
        const modScriptData = await import(
          /* @vite-ignore */ `/assets/mods/${mod.name}/${script}`
        );

        Object.keys(modScriptData).forEach((key) => {
          const lookupKey = key;
          const item = modScriptData[key] as ContentItem;

          console.info(`[${item.__contentType}] ${lookupKey}`, item);

          this.scriptLoaders[item.__contentType]?.(lookupKey, item);
        });

        return modScriptData;
      }),
    );
    console.groupEnd();

    console.groupEnd();
  }
}
