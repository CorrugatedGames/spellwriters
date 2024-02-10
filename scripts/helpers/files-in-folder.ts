import fs from 'fs-extra';

export function numFilesInFolder(folderPath: string): number {
  return fs.readdirSync(folderPath).length;
}
