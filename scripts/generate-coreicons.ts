import fs from 'fs-extra';

const iconpath = './data/sprites/icons/core';

fs.ensureDirSync('./src/assets/mods/core');

const load = async () => {
  const icons = await fs.readdir(iconpath);

  icons.forEach((icon) => {
    fs.copyFile(`${iconpath}/${icon}`, `./src/assets/mods/core/${icon}`);
  });

  console.log('[Build] Core icons copied!');
};

load();
