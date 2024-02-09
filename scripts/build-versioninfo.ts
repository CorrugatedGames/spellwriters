import fs from 'fs-extra';
import describe from 'git-describe';

const { gitDescribeSync } = describe;

let gitRev: unknown = 'UNCOMMITTED';
try {
  gitRev = gitDescribeSync('.', {
    dirtyMark: '',
    dirtySemver: false,
  });
} catch (e) {
  console.error('No git HEAD; default gitRev set.');
}

fs.writeJson(`src/assets/version.json`, gitRev);
console.info('Wrote version information', gitRev);
