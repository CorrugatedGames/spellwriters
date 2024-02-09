import fs from 'fs-extra';
import path from 'path';
import { ContentMod, ContentModImage } from '../src/app/interfaces';

const contentpath = './data/mod/content';
const spritesheetpath = './data/mod/spritesheets';
const iconpath = './data/mod/icons';

const savedir = './src/assets/mods/default';

const iconColors: Record<string, string> = {
  'element-burningoil': '#a54040',
  'element-chargedsteam': '#eafc49',
  'element-earth': '#47b447',
  'element-electric': '#bbbb21',
  'element-fire': '#b33232',
  'element-hydroelectricity': '#fff',
  'element-mud': '#fff',
  'element-oil': '#fff',
  'element-pyroelectricity': '#fff',
  'element-steam': '#fff',
  'element-terraelectricity': '#fff',
  'element-water': '#4bb9b9',
  'rarity-common': '#0b5394',
  'rarity-uncommon': '#4f803a',
  'rarity-rare': '#a1801e',
  'rarity-epic': '#674ea7',
  'rarity-legendary': '#a61c00',
};

const load = async () => {
  const images = await fs.readJson(`${contentpath}/images.json`);
  const characters = await fs.readJson(`${contentpath}/characters.json`);
  const elements = await fs.readJson(`${contentpath}/elements.json`);
  const spells = await fs.readJson(`${contentpath}/spells.json`);
  const spellPatterns = await fs.readJson(`${contentpath}/spell-patterns.json`);
  const spellTags = await fs.readJson(`${contentpath}/spell-tags.json`);
  const aiPatterns = await fs.readJson(`${contentpath}/ai-patterns.json`);
  const rarities = await fs.readJson(`${contentpath}/rarities.json`);
  const relics = await fs.readJson(`${contentpath}/relics.json`);

  const mod: ContentMod = {
    name: 'default',
    description: 'Default game content.',
    version: '0.0.0',
    author: 'Spellwriters',

    characters,
    spells,
    elements,
    spellPatterns,
    spellTags,
    aiPatterns,
    rarities,
    relics,

    preload: {
      colors: iconColors,
      images: {},
      svgs: [],
    },
  };

  fs.ensureDirSync(savedir);

  Object.values(images).forEach((imageData) => {
    const image: ContentModImage = imageData as ContentModImage;
    fs.copyFile(`${spritesheetpath}/${image.name}`, `${savedir}/${image.name}`);

    mod.preload.images[image.name] = image;
  });

  const icons = await fs.readdir(iconpath);
  icons.forEach((icon) => {
    fs.copyFile(`${iconpath}/${icon}`, `${savedir}/${icon}`);
    const iconName = path.basename(icon, '.svg');
    const iconColor = iconColors[iconName];
    if (!iconColor) throw new Error(`No color found for icon ${iconName}`);

    mod.preload.svgs.push({ name: iconName });
  });

  fs.writeJson(`${savedir}/content.json`, mod);

  console.info('[Build] Default mod built!');
};

load();
