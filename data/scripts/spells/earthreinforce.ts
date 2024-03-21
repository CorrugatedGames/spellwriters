import {
  type FieldSpell,
  type RitualCurrentContextSpellArgs,
  type RitualImpl,
  type RitualSpellTagSpacePlacementArgs,
} from '../../../typings/interfaces';

export const earthreinforce: RitualImpl = {
  ...window.api.defaultRitualSpell(),

  onSpellPlaced: (
    opts: RitualSpellTagSpacePlacementArgs,
    context: RitualCurrentContextSpellArgs,
  ) => {
    if (!context) return;
    if (!window.api.isCurrentSpellContextSpell({ funcOpts: opts, context }))
      return;
    if (!window.api.isFirstInvocationOfPlacedSpell({ funcOpts: opts })) return;

    const myStationarySpells: FieldSpell[] = [];

    window.api.getFieldSpaces().forEach((space) => {
      const fieldSpace = window.api.getSpaceFromField(space);
      const tileSpell = fieldSpace?.containedSpell;
      if (!tileSpell || tileSpell.caster !== context.spellContext.spell.caster)
        return;

      const isStationary = window.api.getSpellTagValueByKey({
        spell: tileSpell,
        tag: 'stationary',
      });
      if (!isStationary) return;

      myStationarySpells.push(tileSpell);
    });

    myStationarySpells.forEach((spell) => {
      window.api.setSpellDamage({
        spell: spell,
        damage: spell.damage + myStationarySpells.length,
      });
    });
  },
};
