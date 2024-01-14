const fs = require('fs-extra');
const yaml = require('js-yaml');
const readdir = require('recursive-readdir');

const contentType = process.argv.slice(2)[0];

const allData: Record<string, any> = {};
const filepath = './src/assets/content';
const filename = `${contentType}.json`;

const postprocess: Record<string, (items: any[]) => Promise<void>> = {
  spells: async (items: any[]) => {
    items.forEach((item) => {
      item.tags ??= {};
    });
  },
  characters: async (items: any[]) => {
    const allSpells = await fs.readJson(`${filepath}/spells.json`);
    const spellsByName = Object.values(allSpells).reduce(
      (acc: Record<string, any>, spell: any) => {
        acc[spell.name] = spell;
        return acc;
      },
      {},
    );

    items.forEach((item) => {
      item.deck.spells = item.deck.spells.map((spellName: string) => {
        const spell = spellsByName[spellName];
        return spell?.id ?? `INVALID: ${spellName}`;
      });
    });
  },
};

const save = async () => {
  fs.ensureDirSync(filepath);
  fs.writeFileSync(`${filepath}/${filename}`, JSON.stringify(allData, null, 2));
};

const load = async () => {
  const items = await readdir(`./data/content/${contentType}`);
  const allItems: any[] = [];

  console.log(`[Build] Loading ${contentType}...`);
  items.forEach((spellFile: string) => {
    const data = yaml.load(fs.readFileSync(spellFile, 'utf8'));

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
