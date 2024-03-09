import type {
  RitualCurrentContextSpellArgs,
  RitualImpl,
  RitualSpellSpacePickArgs,
} from '../../../typings/interfaces';

export const wander: RitualImpl = {
  ...window.api.defaultRitualSpellTag(),

  onSpellPickMovementTiles: (
    opts: RitualSpellSpacePickArgs,
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!window.api.isCurrentSpellContextSpell({ funcOpts: opts, context }))
      return [];

    const { x, y } = opts;
    const {
      spellContext: { spell },
    } = context;

    const yDelta = spell.caster === 0 ? -1 : 1;

    return [
      { nextX: x, nextY: y + yDelta },
      { nextX: x + 1, nextY: y + yDelta },
      { nextX: x - 1, nextY: y + yDelta },
    ];
  },
};
