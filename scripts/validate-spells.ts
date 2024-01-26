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
  const spells = await fs.readJson('./data/mod/content/spells.json');

  const allIds: Record<string, boolean> = {};

  Object.values(spells).forEach((spellData: unknown) => {
    const spell = spellData as Spell;

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
      throw new Error(`Spell ${spell.name} has no description`);
    }

    if (spell.sprite < 0) {
      throw new Error(`Spell ${spell.name} has invalid sprite ${spell.sprite}`);
    }

    if (!validRarities.includes(spell.rarity)) {
      throw new Error(`Spell ${spell.name} has invalid rarity ${spell.rarity}`);
    }

    if (!validPatterns.includes(spell.pattern)) {
      throw new Error(
        `Spell ${spell.name} has invalid pattern ${spell.pattern}`,
      );
    }

    if (!validElements.includes(spell.element)) {
      throw new Error(
        `Spell ${spell.name} has invalid element ${spell.element}`,
      );
    }

    if (spell.damage < 0) {
      throw new Error(`Spell ${spell.name} has invalid damage ${spell.damage}`);
    }

    if (spell.speed < 0) {
      throw new Error(`Spell ${spell.name} has invalid speed ${spell.speed}`);
    }

    if (spell.cost < 0) {
      throw new Error(`Spell ${spell.name} has invalid cost ${spell.cost}`);
    }

    if (spell.castTime < 0) {
      throw new Error(
        `Spell ${spell.name} has invalid cast time ${spell.castTime}`,
      );
    }

    if (spell.depthMin < 0) {
      throw new Error(
        `Spell ${spell.name} has invalid min depth ${spell.depthMin}`,
      );
    }

    if (spell.depthMax < 0) {
      throw new Error(
        `Spell ${spell.name} has invalid max depth ${spell.depthMax}`,
      );
    }

    if (spell.depthMin > spell.depthMax) {
      throw new Error(`Spell ${spell.name} has invalid depth range`);
    }

    if (!spell.tags) {
      throw new Error(`Spell ${spell.name} has no tags`);
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
