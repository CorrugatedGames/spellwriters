import child from 'child_process';
import { promisify } from 'util';

import { version } from '../package.json';

const exec = promisify(child.exec);

async function rewriteVersion() {
  await exec(`git tag -d v${version}`);
  await exec(`git tag v${version}`);
}

rewriteVersion();

console.info(
  `Rewrote version to be post-changelog commit instead of pre-changelog commit.`,
);
