import { type ActivePlayer, type GamePhase, type TurnOrder } from './gamestate';
import { type FieldSpell, type SpellStatImpl } from './spell';

export interface RitualDefaultArgs {}

export interface RitualRelicDefaultArgs extends RitualDefaultArgs {
  relicId: string;
  stacks: number;
  owner: ActivePlayer;
}

export interface RitualSpellDefaultArgs extends RitualDefaultArgs {
  spell: FieldSpell;
}

export interface SpellTagSpaceArgs extends RitualSpellDefaultArgs {
  x: number;
  y: number;
}

export interface SpellTagCollisionArgs extends RitualSpellDefaultArgs {
  collidedWith: FieldSpell;
}

export interface RitualCharacterArgs extends RitualDefaultArgs {
  character: ActivePlayer;
}

export interface RitualCurrentContextSpellArgs {
  spellContext: {
    spell: FieldSpell;
  };
}

export interface RitualCurrentContextSpellTagArgs {
  spellTagContext: {
    id: string;
    key: string | undefined;
    stacks: number;
  };
}

export interface RitualCurrentContextRelicArgs {
  relicContext: {
    id: string;
    key: string | undefined;
    stacks: number;
    owner: ActivePlayer;
  };
}

export type RitualCurrentContextArgs =
  | RitualCurrentContextSpellArgs
  | RitualCurrentContextSpellTagArgs
  | RitualCurrentContextRelicArgs;

export interface RitualImpl {
  // fired once per space the spell is placed in (for example, wider spells)
  // ✅ implemented in handleEntireSpellcastSequence
  onSpellPlacement(
    opts: RitualSpellDefaultArgs & { x: number; y: number; placeNum: number },
    context?: RitualCurrentContextArgs,
  ): void;

  // fired when the spell is removed
  // ✅ implemented in removeSpellFromField
  onSpellRemoval(
    opts: RitualSpellDefaultArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // fired if the spell cancels the casting of another spell
  // ✅ implemented in defaultCollisionDamageReduction
  onSpellCancel(
    opts: RitualSpellDefaultArgs & { canceledSpell: FieldSpell },
    context?: RitualCurrentContextArgs,
  ): void;

  // fired if the spell is canceled while casting
  // ✅ implemented in defaultCollisionDamageReduction
  onSpellCanceled(
    opts: RitualSpellDefaultArgs & { canceledBySpell: FieldSpell },
    context?: RitualCurrentContextArgs,
  ): void;

  // fired when the attached spell destroys another spell
  // ✅ implemented in defaultCollisionDamageReduction
  onSpellDestroy(
    opts: RitualSpellDefaultArgs & { destroyedSpell: FieldSpell },
    context?: RitualCurrentContextArgs,
  ): void;

  // fired once per spell instance destroyed
  // ✅ implemented in defaultCollisionDamageReduction
  onSpellDestroyed(
    opts: RitualSpellDefaultArgs & { destroyedBySpell: FieldSpell },
    context?: RitualCurrentContextArgs,
  ): void;

  // fired once per spell dealing damage to the opponent
  // ✅ implemented in moveSpellToPosition
  onSpellDealDamage(
    opts: RitualSpellDefaultArgs & { damage: number },
    context?: RitualCurrentContextArgs,
  ): void;

  // whether or not a space can be entered
  // if any tag, spell, or relic returns false, the space cannot be entered
  // ✅ implemented in moveSpellToPosition
  onSpellSpaceEnter(
    opts: SpellTagSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): boolean;

  // called after entering a space
  // ✅ implemented in moveSpellToPosition
  onSpellSpaceEntered(
    opts: SpellTagSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // whether or not a space can be exited
  // if any tag, spell, or relic returns false, the space cannot be exited
  // ✅ implemented in moveSpellToPosition
  onSpellSpaceExit(
    opts: SpellTagSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): boolean;

  // called after exiting a space
  // ✅ implemented in moveSpellToPosition
  onSpellSpaceExited(
    opts: SpellTagSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // called before the real collision happens
  // ✅ implemented in moveSpellToPosition
  onSpellCollision(
    opts: SpellTagCollisionArgs & { collisionX: number; collisionY: number },
    context?: RitualCurrentContextArgs,
  ): void;

  // ✅ implemented in defaultCollisionWinner
  onSpellCollisionWin(
    opts: SpellTagCollisionArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // ✅ implemented in defaultCollisionWinner
  onSpellCollisionLose(
    opts: SpellTagCollisionArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // ✅ implemented in defaultCollisionWinner
  onSpellCollisionTie(
    opts: SpellTagCollisionArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // ✅ implemented in setSpellStat
  onSpellStatChange(
    opts: RitualSpellDefaultArgs & {
      stat: SpellStatImpl;
      oldValue: string | number;
      newValue: string | number;
    },
    context?: RitualCurrentContextArgs,
  ): void;

  // ✅ implemented in setSpellTag
  onSpellTagChange(
    opts: RitualSpellDefaultArgs & { tag: string; newValue: number },
    context?: RitualCurrentContextArgs,
  ): void;

  // ✅ implemented in nextPhase
  onCombatStart(
    opts: RitualDefaultArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // ✅ implemented in nextPhase
  onCombatFinish(
    opts: RitualDefaultArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // ✅ implemented in nextPhase
  onCombatPhaseChange(
    opts: RitualDefaultArgs & { newPhase: GamePhase; newTurn: TurnOrder },
    context?: RitualCurrentContextArgs,
  ): void;

  // called on all spells any time any player gains mana
  // ✅ implemented in gainMana
  onPlayerGainMana(
    opts: RitualCharacterArgs & { mana: number },
    context?: RitualCurrentContextArgs,
  ): void;

  // called on all spells any time any player loses mana
  // ✅ implemented in loseMana
  onPlayerLoseMana(
    opts: RitualCharacterArgs & { mana: number },
    context?: RitualCurrentContextArgs,
  ): void;

  // called on all spells any time any player gains health
  // ✅ implemented in gainHealth
  onPlayerGainHealth(
    opts: RitualCharacterArgs & { health: number },
    context?: RitualCurrentContextArgs,
  ): void;

  // called on all spells any time any player loses health
  // ✅ implemented in loseHealth
  onPlayerLoseHealth(
    opts: RitualCharacterArgs & { health: number },
    context?: RitualCurrentContextArgs,
  ): void;
}
