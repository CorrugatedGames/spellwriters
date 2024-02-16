/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from 'fs-extra';
import yaml from 'js-yaml';
import readdir from 'recursive-readdir';
import {
  type AIPattern,
  type Character,
  type Rarity,
  type Relic,
  type Spell,
  type SpellElement,
  type SpellPattern,
  type SpellTag,
  type TileStatus,
} from '../src/app/interfaces';

const contentType = process.argv.slice(2)[0];

const allData: Record<string, any> = {};
const filepath = './data/mod/content';
const filename = `${contentType}.json`;

fs.ensureDirSync(filepath);

const postprocess: Record<string, (items: any[]) => Promise<void>> = {
  'tile-status': async (items: TileStatus[]) => {
    items.forEach((item) => {
      item.mod = 'default';
      item.asset = `tile-status.webp`;
    });
  },

  elements: async (items: SpellElement[]) => {
    const elementsByKey = items.reduce(
      (acc: Record<string, SpellElement>, spell: any) => {
        acc[spell.key] = spell;
        return acc;
      },
      {},
    );

    items.forEach((item) => {
      item.mod = 'default';
      item.asset = `elements.webp`;

      item.createdBy = item.createdBy.map((elementName: string) => {
        const element = elementsByKey[elementName];
        return element.id ?? `INVALID: ${elementName}`;
      });

      item.interactions.forEach((interaction) => {
        interaction.element =
          elementsByKey[interaction.element]?.id ??
          `INVALID: ${interaction.element}`;
      });
    });
  },

  spells: async (items: Spell[]) => {
    const allPatterns = await fs.readJson(`${filepath}/spell-patterns.json`);
    const allTags = await fs.readJson(`${filepath}/spell-tags.json`);
    const allElements = await fs.readJson(`${filepath}/elements.json`);
    const allRarities = await fs.readJson(`${filepath}/rarities.json`);

    const patternsByKey = Object.values(allPatterns).reduce(
      (acc: Record<string, SpellPattern>, pattern: any) => {
        acc[pattern.key] = pattern;
        return acc;
      },
      {},
    );

    const elementsByKey = Object.values(allElements).reduce(
      (acc: Record<string, SpellElement>, spell: any) => {
        acc[spell.key] = spell;
        return acc;
      },
      {},
    );

    const tagsByKey = Object.values(allTags).reduce(
      (acc: Record<string, SpellTag>, spellTag: any) => {
        acc[spellTag.key] = spellTag;
        return acc;
      },
      {},
    );

    const raritiesByKey = Object.values(allRarities).reduce(
      (acc: Record<string, Rarity>, spellRarity: any) => {
        acc[spellRarity.key] = spellRarity;
        return acc;
      },
      {},
    );

    items.forEach((item) => {
      item.mod = 'default';
      item.asset = 'spells.webp';
      item.tags ??= {};

      item.element =
        elementsByKey[item.element]?.id ?? `INVALID: ${item.element}`;

      item.pattern =
        patternsByKey[item.pattern]?.id ?? `INVALID: ${item.pattern}`;

      item.rarity = raritiesByKey[item.rarity]?.id ?? `INVALID: ${item.rarity}`;

      const oldTags = item.tags;

      item.tags = {};
      Object.keys(oldTags).forEach((tagKey) => {
        const pattern = tagsByKey[tagKey];
        item.tags[pattern?.id ?? `INVALID: ${tagKey}`] = oldTags[tagKey];
      });
    });
  },

  characters: async (items: Character[]) => {
    const allSpells = await fs.readJson(`${filepath}/spells.json`);
    const aiPatterns = await fs.readJson(`${filepath}/ai-patterns.json`);
    const allRelics = await fs.readJson(`${filepath}/relics.json`);

    const spellsByName = Object.values(allSpells).reduce(
      (acc: Record<string, Spell>, spell: any) => {
        acc[spell.name] = spell;
        return acc;
      },
      {},
    );

    const patternsByName = Object.values(aiPatterns).reduce(
      (acc: Record<string, AIPattern>, pattern: any) => {
        acc[pattern.key] = pattern;
        return acc;
      },
      {},
    );

    const relicsByName = Object.values(allRelics).reduce(
      (acc: Record<string, Relic>, relic: any) => {
        acc[relic.key] = relic;
        return acc;
      },
      {},
    );

    items.forEach((item) => {
      item.mod = 'default';
      item.asset = 'characters.webp';

      item.deck.spells = item.deck.spells.map((spellName: string) => {
        const spell = spellsByName[spellName];
        return spell?.id ?? `INVALID: ${spellName}`;
      });

      const oldBehaviors = item.behaviors ?? {};

      item.behaviors = {};
      Object.keys(oldBehaviors).forEach((behaviorName) => {
        const pattern = patternsByName[behaviorName];
        item.behaviors[pattern?.id ?? `INVALID: ${behaviorName}`] =
          oldBehaviors[behaviorName];
      });

      const oldRelics = item.relics ?? {};

      item.relics = {};
      Object.keys(oldRelics).forEach((relicName) => {
        const relic = relicsByName[relicName];
        item.relics[relic?.id ?? `INVALID: ${relicName}`] =
          oldRelics[relicName];
      });
    });
  },

  relics: async (items: Relic[]) => {
    const allRarities = await fs.readJson(`${filepath}/rarities.json`);

    const raritiesByKey = Object.values(allRarities).reduce(
      (acc: Record<string, Rarity>, spellRarity: any) => {
        acc[spellRarity.key] = spellRarity;
        return acc;
      },
      {},
    );

    items.forEach((item) => {
      item.mod = 'default';
      item.asset = 'relics.webp';

      item.rarity = raritiesByKey[item.rarity]?.id ?? `INVALID: ${item.rarity}`;
    });
  },
};

const save = async () => {
  fs.ensureDirSync(filepath);
  fs.writeJson(`${filepath}/${filename}`, allData);
};

const load = async () => {
  const items = await readdir(`./data/content/${contentType}`);
  const allItems: any[] = [];

  console.info(`[Build] Loading ${contentType}...`);
  items.forEach((spellFile: string) => {
    const data = yaml.load(fs.readFileSync(spellFile, 'utf8')) as any[];

    data.forEach((item: any & { id: string }) => {
      allItems.push(item);
    });
  });

  console.info(`[Build] Loaded ${allItems.length}! Postprocessing...`);
  await postprocess[contentType]?.(allItems);

  console.info(`[Build] Processed ${contentType}!`);

  const allIds: Record<string, boolean> = {};
  allItems.forEach((item: any, index: number) => {
    if (!item.id) {
      item.id = index;
    }

    if (allIds[item.id]) {
      throw new Error(`Duplicate ${contentType} id ${item.id} (${item.name})`);
    }

    allIds[item.id] = true;
    allData[item.id] = item;
  });

  await save();
};

load();
