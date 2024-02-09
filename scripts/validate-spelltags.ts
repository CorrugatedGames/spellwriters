import fs from 'fs-extra';
import { SpellPattern } from '../src/app/interfaces';

const validate = async () => {
  const patterns = (await fs.readJson(
    './data/mod/content/spell-patterns.json',
  )) as unknown as Record<string, SpellPattern>;

  const allIds: Record<string, boolean> = {};

  Object.values(patterns).forEach((patternData: unknown) => {
    const pattern = patternData as SpellPattern;

    if (!pattern.id) {
      throw new Error(`Spell pattern has no id`);
    }

    if (allIds[pattern.id]) {
      throw new Error(`Duplicate spell pattern id ${pattern.id}`);
    }

    allIds[pattern.id] = true;

    if (!pattern.name) {
      throw new Error(`Spell pattern ${pattern.id} has no name`);
    }
  });

  console.info('[Validation] All spell patterns are valid!');
};

validate();
