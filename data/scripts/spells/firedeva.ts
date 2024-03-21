import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type RitualSpellTagSpacePlacementArgs,
} from '../../../typings/interfaces';

export const firedeva: RitualImpl = {
  ...window.api.defaultRitualSpell(),

  onSpellPlaced: (
    opts: RitualSpellTagSpacePlacementArgs,
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!context) return;
    if (!window.api.isCurrentSpellContextSpell({ funcOpts: opts, context }))
      return;
    if (!window.api.isFirstInvocationOfPlacedSpell({ funcOpts: opts })) return;

    const { spell } = opts;

    window.api.getFieldSpaces().forEach((space) => {
      const fieldSpace = window.api.getSpaceFromField(space);
      const tileStatus = fieldSpace?.containedStatus;
      if (tileStatus?.key !== 'devastated') return;

      const devastatedTurns =
        window.api.getExtraDataForFieldStatus<number>({
          status: tileStatus,
          key: 'turnsDevastated',
        }) ?? 2;

      window.api.setExtraDataForFieldStatus({
        status: tileStatus,
        key: 'turnsDevastated',
        value: devastatedTurns + 1,
      });

      window.api.setSpellDamage({
        spell,
        damage: spell.damage + 1,
      });
    });
  },
};
