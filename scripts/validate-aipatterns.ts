import fs from 'fs-extra';
import { type AIPattern } from '../src/app/interfaces';

const validate = async () => {
  const patterns = (await fs.readJson(
    './data/mod/content/ai-patterns.json',
  )) as unknown as Record<string, AIPattern>;

  const allIds: Record<string, boolean> = {};

  Object.values(patterns).forEach((patternData: unknown) => {
    const pattern = patternData as AIPattern;

    if (!pattern.id) {
      throw new Error(`AI Pattern has no id`);
    }

    if (allIds[pattern.id]) {
      throw new Error(`Duplicate ai pattern id ${pattern.id}`);
    }

    allIds[pattern.id] = true;

    if (!pattern.name) {
      throw new Error(`AI attern ${pattern.id} has no name`);
    }
  });

  console.info('[Validation] All AI patterns are valid!');
};

validate();
