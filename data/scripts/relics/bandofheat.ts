import type {
  ActivePlayer,
  RitualCurrentContextRelicArgs,
  RitualImpl,
  RitualSpellSpaceArgs,
} from '../../../typings/interfaces';

const makeSpaceWarm = (x: number, y: number, owner: ActivePlayer) => {
  const fieldStatus = window.api.getSpaceFromField({ x, y });
  if (fieldStatus?.containedStatus) return;

  window.api.setFieldStatus({
    x,
    y,

    status: window.api.tileStatusKeyToTileStatus({
      tileStatusKey: 'warm',
      caster: owner.turnOrder,
      extraData: { turnsWarm: 3 },
    }),
  });
};

export const bandofheat: RitualImpl = {
  ...window.api.defaultRitualRelic(),

  onSpellPlaced(
    opts: RitualSpellSpaceArgs,
    context: RitualCurrentContextRelicArgs,
  ) {
    if (!context) return;
    const {
      relicContext: { owner },
    } = context;

    const { spell, x, y } = opts;

    if (!window.api.isSpellOwnedBy({ spell, owner })) return;
    if (!window.api.isSpellElement({ spell, element: 'fire' })) return;

    makeSpaceWarm(x, y, owner);
  },

  onSpellSpaceEntered: (
    opts: RitualSpellSpaceArgs,
    context: RitualCurrentContextRelicArgs,
  ) => {
    const {
      relicContext: { owner },
    } = context;

    const { spell, x, y } = opts;

    if (!window.api.isSpellOwnedBy({ spell, owner })) return;
    if (!window.api.isSpellElement({ spell, element: 'fire' })) return;

    makeSpaceWarm(x, y, owner);
  },
};
