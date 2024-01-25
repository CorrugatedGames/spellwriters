import fs from 'fs-extra';
import { Character, Spell } from '../src/app/interfaces';

const validate = async () => {
  const characters = fs.readJson('./data/mod/content/characters.json');
  const spells = fs.readJson(
    './data/mod/content/spells.json',
  ) as unknown as Record<string, Spell>;

  const allIds: Record<string, boolean> = {};

  Object.values(characters).forEach((character: Character) => {
    if (!character.id) {
      throw new Error(`Character has no id`);
    }

    if (allIds[character.id]) {
      throw new Error(`Duplicate character id ${character.id}`);
    }

    allIds[character.id] = true;

    if (!character.name) {
      throw new Error(`Character ${character.id} has no name`);
    }

    if (!character.description) {
      throw new Error(`Character ${character.id} has no description`);
    }

    if (character.sprite < 0) {
      throw new Error(`Character ${character.id} has invalid sprite`);
    }

    if (!character.maxHealth) {
      throw new Error(`Character ${character.id} has no max health`);
    }

    if (!character.deck) {
      throw new Error(`Character ${character.id} has no deck`);
    }

    if (!character.deck.name) {
      throw new Error(`Character ${character.id} has no deck cards`);
    }

    if (!character.deck.spells || character.deck.spells.length === 0) {
      throw new Error(`Character ${character.id} has no deck spells`);
    }

    character.deck.spells.forEach((spell: string) => {
      if (!spells[spell]) {
        throw new Error(`Character ${character.id} has invalid spell ${spell}`);
      }
    });
  });

  console.log('[Validation] All characters are valid!');
};

validate();
