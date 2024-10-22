import fs from 'fs-extra';
import type { ContentMod, ContentModImage } from '../src/app/interfaces';

const contentpath = './data/mod/content';
const spritesheetpath = './data/mod/spritesheets';
const scriptpath = './data/mod/scripts';

const savedir = './src/assets/mods/default';

const load = async () => {
  const packageJson = await fs.readJson(`./package.json`);

  const images = await fs.readJson(`${contentpath}/images.json`);
  const characters = await fs.readJson(`${contentpath}/characters.json`);
  const elements = await fs.readJson(`${contentpath}/elements.json`);
  const spells = await fs.readJson(`${contentpath}/spells.json`);
  const spellPatterns = await fs.readJson(`${contentpath}/spell-patterns.json`);
  const spellTags = await fs.readJson(`${contentpath}/spell-tags.json`);
  const aiPatterns = await fs.readJson(`${contentpath}/ai-patterns.json`);
  const rarities = await fs.readJson(`${contentpath}/rarities.json`);
  const relics = await fs.readJson(`${contentpath}/relics.json`);
  const tileStatuses = await fs.readJson(`${contentpath}/tile-status.json`);
  const statusEffects = await fs.readJson(`${contentpath}/status-effects.json`);

  const iconColorHash = await fs.readJsonSync(
    './data/mod/content/colors-default.json',
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
    name: 'default',
    description: 'Default game content.',
    version: '0.0.0',
    gameVersion: packageJson.version,
    author: 'Spellwriters',
    dependsOn: [],

    characters,
    spells,
    elements,
    spellPatterns,
    spellTags,
    aiPatterns,
    rarities,
    relics,
    tileStatuses,
    statusEffects,

    preload: {
      colors: iconColors,
      images: {},
      svgs: [],
      scripts: [],
    },
  };

  fs.ensureDirSync(savedir);

  const allScripts = await fs.readdir(scriptpath);
  allScripts.forEach((script) => {
    fs.copyFile(`${scriptpath}/${script}`, `${savedir}/${script}`);
    mod.preload.scripts.push(script);
  });

  Object.values(images).forEach((imageData) => {
    const image: ContentModImage = imageData as ContentModImage;
    fs.copyFile(`${spritesheetpath}/${image.name}`, `${savedir}/${image.name}`);

    mod.preload.images[image.name] = image;
  });

  fs.writeJson(`${savedir}/content.json`, mod);

  console.info('[Build] Default mod built!');
};

load();
