import { SpellTagImpl } from '../../../interfaces';

export const defaultSpellTag: SpellTagImpl = {
  onSpellPlacement: () => {},
  onSpellDestroy: () => {},
  onSpellCancel: () => {},
  onSpellCanceled: () => {},
  onSpellDestroyed: () => {},
  onSpellDealDamage: () => {},

  onSpaceEnter: () => true,
  onSpaceEntered: () => {},
  onSpaceExit: () => true,
  onSpaceExited: () => {},

  onCollision: () => {},
  onCollisionWin: () => {},
  onCollisionLose: () => {},
  onCollisionTie: () => {},

  onStatChange: () => {},
  onTagChange: () => {},
  onPhaseChange: () => {},

  onPlayerGainHealth: () => {},
  onPlayerLoseHealth: () => {},
  onPlayerGainMana: () => {},
  onPlayerLoseMana: () => {},
};
