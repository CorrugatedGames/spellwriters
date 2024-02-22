import {
  TurnOrder,
  type ContentItem,
  type RitualCurrentContextArgs,
  type RitualImpl,
} from '../../../interfaces';

function debugLog(func: string, opts: { args: unknown; context: unknown }) {
  const { args, context } = opts;

  const ritualContext = context as RitualCurrentContextArgs;

  let owner = 'UNKNOWN';
  if ('spellContext' in ritualContext)
    owner =
      ritualContext.spellContext.spell.caster === TurnOrder.Player
        ? 'PLAYER'
        : 'ENEMY';
  if ('relicContext' in ritualContext)
    owner =
      ritualContext.relicContext.owner.turnOrder === TurnOrder.Player
        ? 'PLAYER'
        : 'ENEMY';

  let type = 'UNKNOWN';
  if ('spellContext' in ritualContext) type = 'SPELL';
  if ('spellTagContext' in ritualContext) type = 'SPELLTAG';
  if ('relicContext' in ritualContext) type = 'RELIC';
  if ('tileContext' in ritualContext) type = 'TILESTATUS';

  let contentType = 'UNKNOWN';
  if ('spellContext' in ritualContext)
    contentType = ritualContext.spellContext.spell.key ?? 'UNKNOWN';
  if ('spellTagContext' in ritualContext)
    contentType = ritualContext.spellTagContext.key ?? 'UNKNOWN';
  if ('relicContext' in ritualContext)
    contentType = ritualContext.relicContext.key ?? 'UNKNOWN';
  if ('tileContext' in ritualContext)
    contentType = ritualContext.tileContext.key ?? 'UNKNOWN';

  console.info(`[${owner}-${type}:${contentType}]`, func, { args, context });
}

export const debugRitual: RitualImpl = {
  onSpellPlace: (args, context) => {
    debugLog('onSpellPlace', { args, context });
    return true;
  },
  onSpellPlaced: (args, context) =>
    debugLog('onSpellPlaced', { args, context }),
  onSpellRemoved: (args, context) =>
    debugLog('onSpellRemoved', { args, context }),
  onSpellDestroy: (args, context) =>
    debugLog('onSpellDestroy', { args, context }),
  onSpellCancel: (args, context) =>
    debugLog('onSpellCancel', { args, context }),
  onSpellCanceled: (args, context) =>
    debugLog('onSpellCanceled', { args, context }),
  onSpellDestroyed: (args, context) =>
    debugLog('onSpellDestroyed', { args, context }),
  onSpellDealDamage: (args, context) =>
    debugLog('onSpellDealDamage', { args, context }),

  onSpellSpaceEnter: (args, context) => {
    debugLog('onSpellSpaceEnter', { args, context });
    return true;
  },
  onSpellSpaceEntered: (args, context) =>
    debugLog('onSpellSpaceEntered', { args, context }),
  onSpellSpaceExit: (args, context) => {
    debugLog('onSpellSpaceExit', { args, context });
    return true;
  },
  onSpellSpaceExited: (args, context) =>
    debugLog('onSpellSpaceExited', { args, context }),

  onSpellCollision: (args, context) =>
    debugLog('onSpellCollision', { args, context }),
  onSpellCollisionWin: (args, context) =>
    debugLog('onSpellCollisionWin', { args, context }),
  onSpellCollisionLose: (args, context) =>
    debugLog('onSpellCollisionLose', { args, context }),
  onSpellCollisionTie: (args, context) =>
    debugLog('onSpellCollisionTie', { args, context }),

  onSpellStatChange: (args, context) =>
    debugLog('onSpellStatChange', { args, context }),
  onSpellTagChange: (args, context) =>
    debugLog('onSpellTagChange', { args, context }),

  onCombatStart: (args, context) =>
    debugLog('onCombatStart', { args, context }),
  onCombatFinish: (args, context) =>
    debugLog('onCombatFinish', { args, context }),
  onCombatPhaseChange: (args, context) =>
    debugLog('onCombatPhaseChange', { args, context }),

  onPlayerGainHealth: (args, context) =>
    debugLog('onPlayerGainHealth', { args, context }),
  onPlayerLoseHealth: (args, context) =>
    debugLog('onPlayerLoseHealth', { args, context }),
  onPlayerGainMana: (args, context) =>
    debugLog('onPlayerGainMana', { args, context }),
  onPlayerLoseMana: (args, context) =>
    debugLog('onPlayerLoseMana', { args, context }),
};

export const plainRitual: RitualImpl = {
  onSpellPlace: () => true,
  onSpellPlaced: () => {},
  onSpellRemoved: () => {},
  onSpellDestroy: () => {},
  onSpellCancel: () => {},
  onSpellCanceled: () => {},
  onSpellDestroyed: () => {},
  onSpellDealDamage: () => {},

  onSpellSpaceEnter: () => true,
  onSpellSpaceEntered: () => {},
  onSpellSpaceExit: () => true,
  onSpellSpaceExited: () => {},

  onSpellCollision: () => {},
  onSpellCollisionWin: () => {},
  onSpellCollisionLose: () => {},
  onSpellCollisionTie: () => {},

  onSpellStatChange: () => {},
  onSpellTagChange: () => {},

  onCombatStart: () => {},
  onCombatFinish: () => {},
  onCombatPhaseChange: () => {},

  onPlayerGainHealth: () => {},
  onPlayerLoseHealth: () => {},
  onPlayerGainMana: () => {},
  onPlayerLoseMana: () => {},
};

const defaultRitual: () => RitualImpl = () => ({
  ...plainRitual,
});

export const defaultRitualRelic: () => RitualImpl & ContentItem = () => ({
  __contentType: 'Relic',
  ...defaultRitual(),
});

export const defaultRitualSpell: () => RitualImpl & ContentItem = () => ({
  __contentType: 'Spell',
  ...defaultRitual(),
});

export const defaultRitualSpellTag: () => RitualImpl & ContentItem = () => ({
  __contentType: 'SpellTag',
  ...defaultRitual(),
});

export const defaultRitualStatusEffect: () => RitualImpl &
  ContentItem = () => ({
  __contentType: 'StatusEffect',
  ...defaultRitual(),
});

export const defaultRitualTileStatus: () => RitualImpl & ContentItem = () => ({
  __contentType: 'TileStatus',
  ...defaultRitual(),
});
