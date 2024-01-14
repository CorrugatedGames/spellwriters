const fs = require('fs-extra');

const validRarities = ['Common', 'Uncommon', 'Rare', 'Mystical', 'Legendary'];
const validPatterns = ['1x1', '2x1', '3x1', '5x1'];
const validElements = ['Fire', 'Water', 'Earth', 'Electric'];
const validTags = [
  'explodes',
  'dissipates',
  'steamy',
  'muddy',
  'oily',
  'defensive',
];

const validate = async () => {
  const spells = fs.readJson('./src/assets/content/spells.json');

  Object.values(spells).forEach((spell: any) => {
    if (!spell.id) {
      throw new Error(`Spell has no id`);
    }

    if (!spell.name) {
      throw new Error(`Spell ${spell.id} has no name`);
    }

    if (!spell.description) {
      throw new Error(`Spell ${spell.id} has no description`);
    }

    if (spell.sprite < 0) {
      throw new Error(`Spell ${spell.id} has invalid sprite`);
    }

    if (!validRarities.includes(spell.rarity)) {
      throw new Error(`Spell ${spell.id} has invalid rarity`);
    }

    if (!validPatterns.includes(spell.pattern)) {
      throw new Error(`Spell ${spell.id} has invalid pattern`);
    }

    if (!validElements.includes(spell.element)) {
      throw new Error(`Spell ${spell.id} has invalid element`);
    }

    if (spell.damage < 0) {
      throw new Error(`Spell ${spell.id} has invalid damage`);
    }

    if (spell.speed < 0) {
      throw new Error(`Spell ${spell.id} has invalid speed`);
    }

    if (spell.cost < 0) {
      throw new Error(`Spell ${spell.id} has invalid cost`);
    }

    if (spell.castTime < 0) {
      throw new Error(`Spell ${spell.id} has invalid cast time`);
    }

    if (spell.depthMin < 0) {
      throw new Error(`Spell ${spell.id} has invalid min depth`);
    }

    if (spell.depthMax < 0) {
      throw new Error(`Spell ${spell.id} has invalid max depth`);
    }

    if (spell.depthMin > spell.depthMax) {
      throw new Error(`Spell ${spell.id} has invalid depth range`);
    }

    if (!spell.tags) {
      throw new Error(`Spell ${spell.id} has no tags`);
    }

    Object.keys(spell.tags).forEach((tag: string) => {
      if (!validTags.includes(tag)) {
        throw new Error(`Spell ${spell.id} has invalid tag ${tag}`);
      }

      if (spell.tags[tag] < 0) {
        throw new Error(`Spell ${spell.id} has invalid tag value ${tag}`);
      }
    });
  });

  console.log('[Validation] All spells are valid!');
};

validate();
