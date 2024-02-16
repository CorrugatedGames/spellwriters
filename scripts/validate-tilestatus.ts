import fs from 'fs-extra';
import { type TileStatus } from '../src/app/interfaces';

const validate = async () => {
  const statuses = (await fs.readJson(
    './data/mod/content/tile-status.json',
  )) as unknown as Record<string, TileStatus>;

  const allIds: Record<string, boolean> = {};

  Object.values(statuses).forEach((statusData: unknown) => {
    const status = statusData as TileStatus;

    if (!status.id) {
      throw new Error(`Tile status has no id`);
    }

    if (allIds[status.id]) {
      throw new Error(`Duplicate tile status id ${status.id}`);
    }

    allIds[status.id] = true;

    if (!status.name) {
      throw new Error(`Tile status ${status.id} has no name`);
    }

    if (!status.key) {
      throw new Error(`Tile status ${status.id} has no key`);
    }

    if (!status.description) {
      throw new Error(`Tile status ${status.id} has no description`);
    }
  });

  console.info('[Validation] All tile statuses are valid!');
};

validate();
