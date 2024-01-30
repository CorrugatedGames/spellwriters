import fs from 'fs-extra';
import { SpellPattern } from '../src/app/interfaces';

const validate = async () => {
  const patterns = (await fs.readJson(
    './data/mod/content/patterns.json',
  )) as unknown as Record<string, SpellPattern>;

  const allIds: Record<string, boolean> = {};

  Object.values(patterns).forEach((patternData: unknown) => {
    const pattern = patternData as SpellPattern;

    if (!pattern.id) {
      throw new Error(`Pattern has no id`);
    }

    if (allIds[pattern.id]) {
      throw new Error(`Duplicate pattern id ${pattern.id}`);
    }

    allIds[pattern.id] = true;

    if (!pattern.name) {
      throw new Error(`Pattern ${pattern.id} has no name`);
    }
  });

  console.log('[Validation] All patterns are valid!');
};

validate();
