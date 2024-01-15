import fs from 'fs-extra';
import yaml from 'js-yaml';
import readdir from 'recursive-readdir';
import { Character, Spell } from '../src/app/interfaces';

const contentType = process.argv.slice(2)[0];

const allData: Record<string, any> = {};
const filepath = './data/mod/content';
const filename = `${contentType}.json`;

const postprocess: Record<string, (items: any[]) => Promise<void>> = {
  spells: async (items: Spell[]) => {
    items.forEach((item) => {
      item.mod = 'default';
      item.asset = 'spells.webp';
      item.tags ??= {};
    });
  },

  characters: async (items: Character[]) => {
    const allSpells = await fs.readJson(`${filepath}/spells.json`);
    const spellsByName = Object.values(allSpells).reduce(
      (acc: Record<string, Spell>, spell: any) => {
        acc[spell.name] = spell;
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

  console.log(`[Build] Loading ${contentType}...`);
  items.forEach((spellFile: string) => {
    const data = yaml.load(fs.readFileSync(spellFile, 'utf8')) as any[];

    data.forEach((item: any & { id: string }) => {
      allItems.push(item);
    });
  });

  console.log(`[Build] Loaded ${allItems.length}! Postprocessing...`);
  await postprocess[contentType]?.(allItems);

  console.log(`[Build] Processed ${contentType}!`);
  allItems.forEach((item: any) => {
    allData[item.id] = item;
  });

  await save();
};

load();
