import fs from 'fs-extra';
import { type StatusEffect, type TileStatus } from '../src/app/interfaces';

const validate = async () => {
  const statuses = (await fs.readJson(
    './data/mod/content/status-effects.json',
  )) as unknown as Record<string, TileStatus>;

  const allIds: Record<string, boolean> = {};

  Object.values(statuses).forEach((statusData: unknown) => {
    const status = statusData as StatusEffect;

    if (!status.id) {
      throw new Error(`Status effect has no id`);
    }

    if (allIds[status.id]) {
      throw new Error(`Duplicate status effects id ${status.id}`);
    }

    allIds[status.id] = true;

    if (!status.name) {
      throw new Error(`Status effect ${status.id} has no name`);
    }

    if (!status.key) {
      throw new Error(`Status effect ${status.id} has no key`);
    }

    if (!status.description) {
      throw new Error(`Status effect ${status.id} has no description`);
    }
  });

  console.info('[Validation] All status effects are valid!');
};

validate();
