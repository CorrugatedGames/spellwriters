import child from 'child_process';
import fs from 'fs-extra';
import { promisify } from 'util';

const exec = promisify(child.exec);

async function rewriteVersion() {
  const packageFile = await fs.readJsonSync('package.json');
  const version = packageFile.version;

  await exec(`git tag -d v${version}`);
  await exec(`git tag v${version}`);
}

rewriteVersion();

console.info(
  `Rewrote version to be post-changelog commit instead of pre-changelog commit.`,
);
