import fs from 'fs-extra';
import {
  Spell,
  SpellElement,
  SpellPattern,
  SpellRarity,
  SpellTag,
} from '../src/app/interfaces';

const validRarities = Object.values(SpellRarity);
const validPatterns = Object.values(SpellPattern);
const validElements = Object.values(SpellElement);
const validTags = Object.values(SpellTag);

const validate = async () => {
  const spells = fs.readJson('./data/mod/content/spells.json');

  const allIds: Record<string, boolean> = {};

  Object.values(spells).forEach((spell: Spell) => {
    if (!spell.id) {
      throw new Error(`Spell has no id`);
    }

    if (allIds[spell.id]) {
      throw new Error(`Duplicate spell id ${spell.id}`);
    }

    allIds[spell.id] = true;

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
      const actualTag: SpellTag = tag as SpellTag;

      if (!validTags.includes(actualTag)) {
        throw new Error(`Spell ${spell.id} has invalid tag ${tag}`);
      }

      if ((spell.tags[actualTag] ?? 0) < 0) {
        throw new Error(`Spell ${spell.id} has invalid tag value ${tag}`);
      }
    });
  });

  console.log('[Validation] All spells are valid!');
};

validate();
