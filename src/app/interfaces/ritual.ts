import { type ActivePlayer, type GamePhase, type TurnOrder } from './gamestate';
import { type FieldSpell, type Spell, type SpellStatImpl } from './spell';
import type { FieldStatus } from './tile';

export interface RitualDefaultArgs {}

export interface RitualRelicDefaultArgs extends RitualDefaultArgs {
  relicId: string;
  stacks: number;
  owner: ActivePlayer;
}

export interface RitualSpellPlaceCheckArgs {
  spell: Spell;
  x: number;
  y: number;
}

export interface RitualSpellDefaultArgs extends RitualDefaultArgs {
  spell: FieldSpell;
}

export interface RitualSpellTagSpaceArgs extends RitualSpellDefaultArgs {
  x: number;
  y: number;
}

export interface RitualSpellTagSpacePlacementArgs
  extends RitualSpellTagSpaceArgs {
  placeNum: number;
}

export interface RitualSpellTagCollisionArgs extends RitualSpellDefaultArgs {
  collidedWith: FieldSpell;
}

export interface RitualSpellTagCollisionSpaceArgs
  extends RitualSpellTagCollisionArgs {
  collisionX: number;
  collisionY: number;
}

export interface RitualCharacterArgs extends RitualDefaultArgs {
  character: ActivePlayer;
}

export interface RitualCharacterManaArgs extends RitualCharacterArgs {
  mana: number;
}

export interface RitualCharacterHealthArgs extends RitualCharacterArgs {
  health: number;
}

export interface RitualSpellCancelArgs extends RitualSpellDefaultArgs {
  canceledSpell: FieldSpell;
}

export interface RitualSpellCanceledArgs extends RitualSpellDefaultArgs {
  canceledBySpell: FieldSpell;
}

export interface RitualSpellDestroyArgs extends RitualSpellDefaultArgs {
  destroyedSpell: FieldSpell;
}

export interface RitualSpellDestroyedArgs extends RitualSpellDefaultArgs {
  destroyedBySpell: FieldSpell;
}

export interface RitualSpellDamageArgs extends RitualSpellDefaultArgs {
  damage: number;
}

export interface RitualSpellTagChangeArgs extends RitualSpellDefaultArgs {
  tag: string;
  newValue: number;
}

export interface RitualSpellStatChangeArgs extends RitualSpellDefaultArgs {
  stat: SpellStatImpl;
  oldValue: string | number;
  newValue: string | number;
}

export interface RitualPhaseChangeArgs extends RitualDefaultArgs {
  newPhase: GamePhase;
  newTurn: TurnOrder;
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

export interface RitualCurrentContextStatusEffectArgs {
  statusEffectContext: {
    id: string;
    key: string | undefined;
    stacks: number;
    owner: ActivePlayer;
  };
}

export interface RitualCurrentContextTileArgs {
  tileContext: {
    id: string;
    key: string | undefined;
    tileStatus: FieldStatus;
    x: number;
    y: number;
  };
}

export type RitualCurrentContextArgs =
  | RitualCurrentContextSpellArgs
  | RitualCurrentContextSpellTagArgs
  | RitualCurrentContextRelicArgs
  | RitualCurrentContextStatusEffectArgs
  | RitualCurrentContextTileArgs;

export interface RitualImpl {
  // fired when figuring out valid spell placement locations
  // ✅ implemented in getTargettableSpacesForSpellAroundPosition
  onSpellPlace(
    opts: RitualSpellPlaceCheckArgs,
    context?: RitualCurrentContextArgs,
  ): boolean;

  // fired once per space the spell is placed in (for example, wider spells)
  // ✅ implemented in handleEntireSpellcastSequence
  onSpellPlaced(
    opts: RitualSpellTagSpacePlacementArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // fired when the spell is removed
  // ✅ implemented in removeSpellFromField
  onSpellRemoved(
    opts: RitualSpellDefaultArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // fired if the spell cancels the casting of another spell
  // ✅ implemented in defaultCollisionDamageReduction
  onSpellCancel(
    opts: RitualSpellCancelArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // fired if the spell is canceled while casting
  // ✅ implemented in defaultCollisionDamageReduction
  onSpellCanceled(
    opts: RitualSpellCanceledArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // fired when the attached spell destroys another spell
  // ✅ implemented in defaultCollisionDamageReduction
  onSpellDestroy(
    opts: RitualSpellDestroyArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // fired once per spell instance destroyed
  // ✅ implemented in defaultCollisionDamageReduction
  onSpellDestroyed(
    opts: RitualSpellDestroyedArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // fired once per spell dealing damage to the opponent
  // ✅ implemented in moveSpellToPosition
  onSpellDealDamage(
    opts: RitualSpellDamageArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // whether or not a space can be entered
  // if any tag, spell, or relic returns false, the space cannot be entered
  // ✅ implemented in moveSpellToPosition
  onSpellSpaceEnter(
    opts: RitualSpellTagSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): boolean;

  // called after entering a space
  // ✅ implemented in moveSpellToPosition
  onSpellSpaceEntered(
    opts: RitualSpellTagSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // whether or not a space can be exited
  // if any tag, spell, or relic returns false, the space cannot be exited
  // ✅ implemented in moveSpellToPosition
  onSpellSpaceExit(
    opts: RitualSpellTagSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): boolean;

  // called after exiting a space
  // ✅ implemented in moveSpellToPosition
  onSpellSpaceExited(
    opts: RitualSpellTagSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // called before the real collision happens
  // ✅ implemented in moveSpellToPosition
  onSpellCollision(
    opts: RitualSpellTagCollisionSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // ✅ implemented in defaultCollisionWinner
  onSpellCollisionWin(
    opts: RitualSpellTagCollisionArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // ✅ implemented in defaultCollisionWinner
  onSpellCollisionLose(
    opts: RitualSpellTagCollisionArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // ✅ implemented in defaultCollisionWinner
  onSpellCollisionTie(
    opts: RitualSpellTagCollisionArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // ✅ implemented in setSpellStat
  onSpellStatChange(
    opts: RitualSpellStatChangeArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // ✅ implemented in setSpellTag
  onSpellTagChange(
    opts: RitualSpellTagChangeArgs,
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
    opts: RitualPhaseChangeArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // called on all spells any time any player gains mana
  // ✅ implemented in gainMana
  onPlayerGainMana(
    opts: RitualCharacterManaArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // called on all spells any time any player loses mana
  // ✅ implemented in loseMana
  onPlayerLoseMana(
    opts: RitualCharacterManaArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // called on all spells any time any player gains health
  // ✅ implemented in gainHealth
  onPlayerGainHealth(
    opts: RitualCharacterHealthArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // called on all spells any time any player loses health
  // ✅ implemented in loseHealth
  onPlayerLoseHealth(
    opts: RitualCharacterHealthArgs,
    context?: RitualCurrentContextArgs,
  ): void;
}
