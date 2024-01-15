import fs from 'fs-extra';
import { ContentMod } from '../src/app/interfaces';

const contentpath = './data/mod/content';
const spritesheetpath = './data/mod/spritesheets';

const allSpritesheets = ['characters', 'spells'];

const savedir = './src/assets/mods/default';

const load = async () => {
  const characters = await fs.readJson(`${contentpath}/characters.json`);
  const spells = await fs.readJson(`${contentpath}/spells.json`);

  const mod: ContentMod = {
    name: 'Default',
    description: 'Default game content.',
    version: '0.0.0',
    author: 'Spellwriters',

    characters,
    spells,
  };

  fs.ensureDirSync(savedir);

  fs.writeJson(`${savedir}/content.json`, mod);

  allSpritesheets.forEach((spritesheet) => {
    fs.copyFile(
      `${spritesheetpath}/${spritesheet}.png`,
      `${savedir}/${spritesheet}.png`,
    );
    fs.copyFile(
      `${spritesheetpath}/${spritesheet}.webp`,
      `${savedir}/${spritesheet}.webp`,
    );
  });

  console.log('[Build] Default mod built!');
};

load();
