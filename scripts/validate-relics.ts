import fs from 'fs-extra';
import { Rarity, Relic } from '../src/app/interfaces';

const validate = async () => {
  const relics = (await fs.readJson(
    './data/mod/content/relics.json',
  )) as unknown as Record<string, Relic>;
  const rarities = await fs.readJson('./data/mod/content/rarities.json');

  const validRarities = Object.values(rarities).map(
    (rarity: unknown) => (rarity as Rarity).id,
  );

  const allIds: Record<string, boolean> = {};

  Object.values(relics).forEach((relicData: unknown) => {
    const relic = relicData as Relic;

    if (!relic.id) {
      throw new Error(`Relic has no id`);
    }

    if (allIds[relic.id]) {
      throw new Error(`Duplicate relic id ${relic.id}`);
    }

    allIds[relic.id] = true;

    if (!relic.name) {
      throw new Error(`Relic ${relic.id} has no name`);
    }

    if (!relic.key) {
      throw new Error(`Relic ${relic.name} has no key`);
    }

    if (!relic.description) {
      throw new Error(`Relic ${relic.name} has no description`);
    }

    if (!relic.rarity) {
      throw new Error(`Relic ${relic.name} has no rarity`);
    }

    if (!validRarities.includes(relic.rarity)) {
      throw new Error(`Relic ${relic.name} has invalid rarity ${relic.rarity}`);
    }
  });

  console.info('[Validation] All relic are valid!');
};

validate();
