import { ActivePlayer, GamePhase, TurnOrder } from './gamestate';
import { FieldSpell, SpellStat } from './spell';

export interface SpellTag {
  name: string;
  id: string;
  key: string;
}

export interface SpellTagDefaultArgs {
  spell: FieldSpell;
}

export interface SpellTagSpaceArgs extends SpellTagDefaultArgs {
  x: number;
  y: number;
}

export interface SpellTagCollisionArgs extends SpellTagDefaultArgs {
  collidedWith: FieldSpell;
}

export interface SpellTagImpl {
  // fired once per space the spell is placed in (for example, wider spells)
  // ✅ implemented in handleEntireSpellcastSequence
  onSpellPlacement(
    opts: SpellTagDefaultArgs & { x: number; y: number; placeNum: number },
  ): void;

  // fired if the spell cancels the casting of another spell
  // ✅ implemented in defaultCollisionDamageReduction
  onSpellCancel(
    opts: SpellTagDefaultArgs & { canceledSpell: FieldSpell },
  ): void;

  // fired if the spell is canceled while casting
  // ✅ implemented in defaultCollisionDamageReduction
  onSpellCanceled(
    opts: SpellTagDefaultArgs & { canceledBySpell: FieldSpell },
  ): void;

  // fired when the attached spell destroys another spell
  // ✅ implemented in defaultCollisionDamageReduction
  onSpellDestroy(
    opts: SpellTagDefaultArgs & { destroyedSpell: FieldSpell },
  ): void;

  // fired once per spell instance destroyed
  // ✅ implemented in defaultCollisionDamageReduction
  onSpellDestroyed(
    opts: SpellTagDefaultArgs & { destroyedBySpell: FieldSpell },
  ): void;

  // fired once per spell dealing damage to the opponent
  // ✅ implemented in moveSpellToPosition
  onSpellDealDamage(opts: SpellTagDefaultArgs & { damage: number }): void;

  // whether or not a space can be entered
  // if any tag returns false, the space cannot be entered
  // ✅ implemented in moveSpellToPosition
  onSpaceEnter(opts: SpellTagSpaceArgs): boolean;

  // called after entering a space
  // ✅ implemented in moveSpellToPosition
  onSpaceEntered(opts: SpellTagSpaceArgs): void;

  // whether or not a space can be exited
  // if any tag returns false, the space cannot be exited
  // ✅ implemented in moveSpellToPosition
  onSpaceExit(opts: SpellTagSpaceArgs): boolean;

  // called after exiting a space
  // ✅ implemented in moveSpellToPosition
  onSpaceExited(opts: SpellTagSpaceArgs): void;

  // called before the real collision happens
  // ✅ implemented in moveSpellToPosition
  onCollision(
    opts: SpellTagCollisionArgs & { collisionX: number; collisionY: number },
  ): void;

  // ✅ implemented in defaultCollisionWinner
  onCollisionWin(opts: SpellTagCollisionArgs): void;

  // ✅ implemented in defaultCollisionWinner
  onCollisionLose(opts: SpellTagCollisionArgs): void;

  // ✅ implemented in defaultCollisionWinner
  onCollisionTie(opts: SpellTagCollisionArgs): void;

  // ✅ implemented in setSpellStat
  onStatChange(
    opts: SpellTagDefaultArgs & {
      stat: SpellStat;
      oldValue: string | number;
      newValue: string | number;
    },
  ): void;

  // ✅ implemented in setSpellTag
  onTagChange(
    opts: SpellTagDefaultArgs & { tag: string; newValue: number },
  ): void;

  // ✅ implemented in nextPhase
  onPhaseChange(
    opts: SpellTagDefaultArgs & { newPhase: GamePhase; newTurn: TurnOrder },
  ): void;

  // called on all spells any time any player gains mana
  // ✅ implemented in gainMana
  onPlayerGainMana(
    opts: SpellTagDefaultArgs & { character: ActivePlayer; mana: number },
  ): void;

  // called on all spells any time any player loses mana
  // ✅ implemented in loseMana
  onPlayerLoseMana(
    opts: SpellTagDefaultArgs & { character: ActivePlayer; mana: number },
  ): void;

  // called on all spells any time any player gains health
  // ✅ implemented in gainHealth
  onPlayerGainHealth(
    opts: SpellTagDefaultArgs & { character: ActivePlayer; health: number },
  ): void;

  // called on all spells any time any player loses health
  // ✅ implemented in loseHealth
  onPlayerLoseHealth(
    opts: SpellTagDefaultArgs & { character: ActivePlayer; health: number },
  ): void;
}
