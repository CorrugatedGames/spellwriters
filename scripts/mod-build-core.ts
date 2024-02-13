import fs from 'fs-extra';
import path from 'path';
import { type ContentMod } from '../src/app/interfaces';

const iconpath = './data/icons/core';

const savedir = './src/assets/mods/core';

const load = async () => {
  const packageJson = await fs.readJson(`./package.json`);

  const iconColorHash = await fs.readJsonSync(
    './data/mod/content/colors-core.json',
  );
  const iconColors = Object.values(iconColorHash).reduce(
    (acc: Record<string, string>, iter: unknown) => {
      const iterData = iter as { name: string; color: string };
      acc[iterData.name] = iterData.color;
      return acc;
    },
    {},
  ) as Record<string, string>;

  const mod: ContentMod = {
    name: 'core',
    description: 'Core game assets. Cannot be disabled.',
    version: '0.0.0',
    gameVersion: packageJson.version,
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
      scripts: [],
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

  console.info('[Build] Core mod built!');
};

load();
