import fs from 'fs-extra';
import { Spell, SpellElement } from '../src/app/interfaces';
import { numFilesInFolder } from './helpers/files-in-folder';

const validate = async () => {
  const elements = (await fs.readJson(
    './data/mod/content/elements.json',
  )) as unknown as Record<string, Spell>;

  const numSprites = numFilesInFolder('./data/sprites/elements');

  const allIds: Record<string, boolean> = {};

  Object.values(elements).forEach((elementData: unknown) => {
    const element = elementData as SpellElement;

    if (!element.id) {
      throw new Error(`Element has no id`);
    }

    if (allIds[element.id]) {
      throw new Error(`Duplicate element id ${element.id}`);
    }

    allIds[element.id] = true;

    if (!element.name) {
      throw new Error(`Element ${element.id} has no name`);
    }

    if (!element.key) {
      throw new Error(`Element ${element.name} has no key`);
    }

    if (element.sprite < 0 || element.sprite >= numSprites) {
      throw new Error(`Element ${element.name} has no sprite`);
    }

    if (!element.createdBy) {
      throw new Error(`Element ${element.name} has no createdBy`);
    }

    if (!element.description) {
      throw new Error(`Element ${element.name} has no description`);
    }

    if (!element.interactions) {
      throw new Error(`Element ${element.name} has no interactions array`);
    }
  });

  Object.values(elements).forEach((elementData: unknown) => {
    const element = elementData as SpellElement;

    element.interactions.forEach((interaction) => {
      if (!allIds[interaction.element]) {
        throw new Error(
          `Element ${element.name} has invalid interaction ${interaction.element}`,
        );
      }
    });
  });

  console.info('[Validation] All elements are valid!');
};

validate();
