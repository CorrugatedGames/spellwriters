import fs from 'fs-extra';

const iconpath = './data/sprites/icons/elements';

fs.ensureDirSync('./data/mod/icons');

const load = async () => {
  const icons = await fs.readdir(iconpath);

  icons.forEach((icon) => {
    fs.copyFile(`${iconpath}/${icon}`, `./data/mod/icons/${icon}`);
  });

  console.log('[Build] Default mod icons copied!');
};

load();
