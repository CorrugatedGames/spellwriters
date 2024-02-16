import { execSync } from 'child_process';
import chokidar from 'chokidar';
import fs from 'fs-extra';

const runCommand = (command: string) => {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(error);
  }
};

const rebuildCoreMod = () => {
  runCommand('npm run mod:build:core');
};

const rebuildDefaultMod = () => {
  runCommand('npm run mod:build:default');
};

const startWatch = async () => {
  chokidar.watch('src/app/helpers').on('change', (name) => {
    console.info(`[helpers] ${name} changed. Rebuilding types...`);

    runCommand('npm run typescript:types');
    console.info('[helpers] Rebuilt.');
  });

  chokidar.watch('src/app/interfaces').on('change', (name) => {
    console.info(`[interfaces] ${name} changed. Rebuilding types...`);

    runCommand('npm run typescript:types');
    console.info('[interfaces] Rebuilt.');
  });

  chokidar.watch('data/icons').on('change', (name) => {
    console.info(`[icons] ${name} changed. Rebuilding...`);

    runCommand('npm run mod:build:core');
    rebuildCoreMod();
  });

  chokidar.watch('data/sprites').on('change', (name) => {
    console.info(`[sprites] ${name} changed. Rebuilding...`);

    runCommand('npm run art');
    console.info('[sprites] Rebuilt.');

    rebuildDefaultMod();
  });

  chokidar.watch('data/scripts').on('change', (name) => {
    console.info(`[scripts] ${name} changed. Rebuilding...`);

    runCommand('npm run typescript:mods');

    rebuildDefaultMod();
  });

  const allContentFolders = fs.readdirSync('data/content');
  allContentFolders.forEach((folder) => {
    chokidar.watch(`data/content/${folder}`).on('change', (name) => {
      console.info(`[${folder}] ${name} changed. Rebuilding...`);

      runCommand(`npm run content:${folder}`);
      console.info(`[${folder}] Rebuilt.`);

      if (folder.includes('-core')) {
        rebuildCoreMod();
      } else {
        rebuildDefaultMod();
      }
    });
  });

  console.info('Watching gamedata for changes...');
};

startWatch();
