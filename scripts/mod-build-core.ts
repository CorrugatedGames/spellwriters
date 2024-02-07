import fs from 'fs-extra';
import path from 'path';
import { ContentMod } from '../src/app/interfaces';

const iconpath = './data/sprites/icons/core';

const savedir = './src/assets/mods/core';

const iconColors: Record<string, string> = {
  'core-spellwriters': '#fff',
  'external-blog': '#ccc',
  'external-discord': '#ccc',
  'external-email': '#ccc',
  'external-facebook': '#ccc',
  'external-reddit': '#ccc',
  'external-twitter': '#ccc',
  'external-youtube': '#ccc',
  'play-nextturn': '#fff',
  'stat-casttime': '#717fcc',
  'stat-cost': '#d46cc7',
  'stat-damage': '#e07d7d',
  'stat-depth': '#4adde7',
  'stat-pattern': '#d3e68e',
  'stat-speed': '#68d468',
};

const load = async () => {
  const mod: ContentMod = {
    name: 'core',
    description: 'Core game assets. Cannot be disabled.',
    version: '0.0.0',
    author: 'Spellwriters',

    characters: {},
    spells: {},
    elements: {},
    spellPatterns: {},
    aiPatterns: {},
    spellTags: {},
    rarities: {},
    relics: {},

    preload: {
      colors: iconColors,
      images: {},
      svgs: [],
    },
  };

  fs.ensureDirSync(savedir);

  const icons = await fs.readdir(iconpath);
  icons.forEach((icon) => {
    fs.copyFile(`${iconpath}/${icon}`, `${savedir}/${icon}`);
    const iconName = path.basename(icon, '.svg');
    const iconColor = iconColors[iconName];
    if (!iconColor) throw new Error(`No color found for icon ${iconName}`);

    mod.preload.svgs.push({ name: iconName });
  });

  fs.writeJson(`${savedir}/content.json`, mod);

  console.log('[Build] Core mod built!');
};

load();
