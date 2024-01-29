import fs from 'fs-extra';
import path from 'path';
import { ContentMod } from '../src/app/interfaces';

const iconpath = './data/sprites/icons/core';

const savedir = './src/assets/mods/core';

const load = async () => {
  const mod: ContentMod = {
    name: 'core',
    description: 'Core game assets. Cannot be disabled.',
    version: '0.0.0',
    author: 'Spellwriters',

    characters: {},
    spells: {},
    elements: {},

    preload: {
      svgs: [],
    },
  };

  fs.ensureDirSync(savedir);

  const icons = await fs.readdir(iconpath);
  icons.forEach((icon) => {
    fs.copyFile(`${iconpath}/${icon}`, `${savedir}/${icon}`);
    mod.preload.svgs.push(path.basename(icon, '.svg'));
  });

  fs.writeJson(`${savedir}/content.json`, mod);

  console.log('[Build] Core mod built!');
};

load();
