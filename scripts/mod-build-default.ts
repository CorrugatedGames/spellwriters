import fs from 'fs-extra';
import path from 'path';
import { ContentMod } from '../src/app/interfaces';

const contentpath = './data/mod/content';
const spritesheetpath = './data/mod/spritesheets';
const iconpath = './data/mod/icons';

const allSpritesheets = ['characters', 'spells'];

const savedir = './src/assets/mods/default';

const load = async () => {
  const characters = await fs.readJson(`${contentpath}/characters.json`);
  const elements = await fs.readJson(`${contentpath}/elements.json`);
  const spells = await fs.readJson(`${contentpath}/spells.json`);
  const spellPatterns = await fs.readJson(`${contentpath}/spell-patterns.json`);
  const aiPatterns = await fs.readJson(`${contentpath}/ai-patterns.json`);

  const mod: ContentMod = {
    name: 'default',
    description: 'Default game content.',
    version: '0.0.0',
    author: 'Spellwriters',

    characters,
    spells,
    elements,
    spellPatterns,
    aiPatterns,

    preload: {
      svgs: [],
    },
  };

  fs.ensureDirSync(savedir);

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

  const icons = await fs.readdir(iconpath);
  icons.forEach((icon) => {
    fs.copyFile(`${iconpath}/${icon}`, `${savedir}/${icon}`);
    mod.preload.svgs.push(path.basename(icon, '.svg'));
  });

  fs.writeJson(`${savedir}/content.json`, mod);

  console.log('[Build] Default mod built!');
};

load();
