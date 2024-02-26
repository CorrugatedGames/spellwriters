import {
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type RitualSpellTagSpacePlacementArgs,
} from '../../../typings/interfaces';

export const earthconvert1: RitualImpl = {
  ...window.api.defaultRitualSpell(),

  onSpellPlaced: (
    opts: RitualSpellTagSpacePlacementArgs,
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!context) return;
    if (!window.api.isCurrentSpellContextSpell({ funcOpts: opts, context }))
      return;
    if (!window.api.isFirstInvocationOfPlacedSpell({ funcOpts: opts })) return;

    window.api.getFieldSpaces().forEach((space) => {
      const fieldSpace = window.api.getSpaceFromField(space);
      const tileStatus = fieldSpace?.containedStatus;
      if (tileStatus?.key !== 'devastated') return;

      window.api.setFieldStatus({
        ...space,

        status: window.api.tileStatusKeyToTileStatus({
          tileStatusKey: 'fertile',
          caster: tileStatus.caster,
          extraData: { turnsFertile: 3 },
        }),
      });
    });
  },
};
