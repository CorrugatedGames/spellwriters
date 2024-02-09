import fs from 'fs-extra';
import { Rarity, Spell } from '../src/app/interfaces';

const validate = async () => {
  const rarities = (await fs.readJson(
    './data/mod/content/rarities.json',
  )) as unknown as Record<string, Spell>;

  const allIds: Record<string, boolean> = {};

  Object.values(rarities).forEach((rarityData: unknown) => {
    const rarity = rarityData as Rarity;

    if (!rarity.id) {
      throw new Error(`Rarity has no id`);
    }

    if (allIds[rarity.id]) {
      throw new Error(`Duplicate rarity id ${rarity.id}`);
    }

    allIds[rarity.id] = true;

    if (!rarity.name) {
      throw new Error(`Rarity ${rarity.id} has no name`);
    }

    if (!rarity.key) {
      throw new Error(`Rarity ${rarity.name} has no key`);
    }
  });

  console.info('[Validation] All rarities are valid!');
};

validate();
