import fs from 'fs-extra';
import { Character } from '../src/app/interfaces';

const validate = async () => {
  const characters = await fs.readJson('./data/mod/content/characters.json');
  const spells = await fs.readJson('./data/mod/content/spells.json');
  const behaviors = await fs.readJson('./data/mod/content/ai-patterns.json');
  const relics = await fs.readJson('./data/mod/content/relics.json');

  const allIds: Record<string, boolean> = {};

  Object.values(characters).forEach((characterData: unknown) => {
    const character = characterData as Character;

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
      throw new Error(`Character ${character.name} has no description`);
    }

    if (character.sprite < 0) {
      throw new Error(
        `Character ${character.name} has invalid sprite ${character.sprite}`,
      );
    }

    if (!character.maxHealth) {
      throw new Error(`Character ${character.name} has no max health`);
    }

    if (!character.deck) {
      throw new Error(`Character ${character.name} has no deck`);
    }

    if (!character.deck.name) {
      throw new Error(`Character ${character.name} has no deck name`);
    }

    if (!character.deck.spells || character.deck.spells.length === 0) {
      throw new Error(`Character ${character.name} has no deck spells`);
    }

    character.deck.spells.forEach((spell: string) => {
      if (!spells[spell]) {
        throw new Error(
          `Character ${character.name} has invalid spell ${spell}`,
        );
      }
    });

    Object.keys(character.behaviors).forEach((behavior) => {
      if (!behaviors[behavior]) {
        throw new Error(
          `Character ${character.name} has invalid behavior ${behavior}`,
        );
      }
    });

    Object.keys(character.relics).forEach((relic) => {
      if (!relics[relic]) {
        throw new Error(
          `Character ${character.name} has invalid relic ${relic}`,
        );
      }
    });
  });

  console.info('[Validation] All characters are valid!');
};

validate();
