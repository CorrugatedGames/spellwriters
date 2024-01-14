const fs = require('fs-extra');

const validate = async () => {
  const characters = fs.readJson('./src/assets/content/characters.json');
  const spells = fs.readJson('./src/assets/content/spells.json');

  Object.values(characters).forEach((character: any) => {
    if (!character.id) {
      throw new Error(`Character has no id`);
    }

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
