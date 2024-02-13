import * as Electron from './electron/in-electron';

import * as GameplayAI from './gameplay/ai';
import * as GameplayError from './gameplay/error';
import * as GameplayField from './gameplay/field';
import * as GameplayHand from './gameplay/hand';
import * as GameplayInit from './gameplay/init';
import * as GameplayMeta from './gameplay/meta';
import * as GameplayRitual from './gameplay/ritual';
import * as GameplaySignal from './gameplay/signal';
import * as GameplaySpell from './gameplay/spell';
import * as GameplayStats from './gameplay/stats';
import * as GameplayTargetting from './gameplay/targetting';
import * as GameplayTransform from './gameplay/transform';
import * as GameplayTurn from './gameplay/turn';
import * as GameplayVFX from './gameplay/vfx';

import * as GameplayDefaultAI from './gameplay/defaults/ai-patterns';
import * as GameplayDefaultCollisions from './gameplay/defaults/collisions';
import * as GameplayDefaultRitual from './gameplay/defaults/ritual';
import * as GameplayDefaultSpellPatterns from './gameplay/defaults/spell-patterns';

import * as LookupAI from './lookup/ai-patterns';
import * as Lookupcharacters from './lookup/characters';
import * as LookupElements from './lookup/elements';
import * as LookupMods from './lookup/mods';
import * as LookupRelics from './lookup/relics';
import * as LookupSpellPatterns from './lookup/spell-patterns';
import * as LookupSpellTags from './lookup/spell-tags';
import * as LookupSpells from './lookup/spells';
import * as LookupStats from './lookup/stats';

import * as StaticArray from './static/array';
import * as StaticObject from './static/object';
import * as StaticRNG from './static/rng';
import * as StaticSprite from './static/sprite';
import * as StaticTime from './static/time';
import * as StaticUUID from './static/uuid';

export const AllHelpers = {
  ...Electron,
  ...GameplayAI,
  ...GameplayError,
  ...GameplayField,
  ...GameplayHand,
  ...GameplayInit,
  ...GameplayMeta,
  ...GameplayRitual,
  ...GameplaySignal,
  ...GameplaySpell,
  ...GameplayStats,
  ...GameplayTargetting,
  ...GameplayTransform,
  ...GameplayTurn,
  ...GameplayVFX,
  ...GameplayDefaultAI,
  ...GameplayDefaultCollisions,
  ...GameplayDefaultRitual,
  ...GameplayDefaultSpellPatterns,
  ...LookupAI,
  ...Lookupcharacters,
  ...LookupElements,
  ...LookupMods,
  ...LookupRelics,
  ...LookupSpellPatterns,
  ...LookupSpellTags,
  ...LookupSpells,
  ...LookupStats,
  ...StaticArray,
  ...StaticObject,
  ...StaticRNG,
  ...StaticSprite,
  ...StaticTime,
  ...StaticUUID,
};

export * from './electron/in-electron';
export * from './gameplay/ai';
export * from './gameplay/defaults/ai-patterns';
export * from './gameplay/defaults/collisions';
export * from './gameplay/defaults/ritual';
export * from './gameplay/defaults/spell-patterns';
export * from './gameplay/error';
export * from './gameplay/field';
export * from './gameplay/hand';
export * from './gameplay/init';
export * from './gameplay/meta';
export * from './gameplay/ritual';
export * from './gameplay/signal';
export * from './gameplay/spell';
export * from './gameplay/stats';
export * from './gameplay/targetting';
export * from './gameplay/transform';
export * from './gameplay/turn';
export * from './gameplay/vfx';
export * from './lookup/ai-patterns';
export * from './lookup/characters';
export * from './lookup/elements';
export * from './lookup/mods';
export * from './lookup/relics';
export * from './lookup/spell-patterns';
export * from './lookup/spell-tags';
export * from './lookup/spells';
export * from './lookup/stats';
export * from './static/array';
export * from './static/object';
export * from './static/rng';
export * from './static/sprite';
export * from './static/time';
export * from './static/uuid';
