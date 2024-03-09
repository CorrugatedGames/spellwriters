import { type ActivePlayer, type GamePhase, type TurnOrder } from './gamestate';
import { type FieldSpell, type Spell, type SpellStatImpl } from './spell';
import type { FieldStatus } from './tile';

/**
 * @category Ritual
 */
export interface RitualDefaultArgs {}

/**
 * @category Ritual
 */
export interface RitualRelicDefaultArgs extends RitualDefaultArgs {
  relicId: string;
  stacks: number;
  owner: ActivePlayer;
}

/**
 * @category Ritual
 */
export interface RitualSpellPlaceCheckArgs {
  spell: Spell;
  x: number;
  y: number;
}

/**
 * @category Ritual
 */
export interface RitualSpellDefaultArgs extends RitualDefaultArgs {
  spell: FieldSpell;
}

/**
 * @category Ritual
 */
export interface RitualSpellSpaceArgs extends RitualSpellDefaultArgs {
  x: number;
  y: number;
}

/**
 * @category Ritual
 */
export interface RitualSpellSpacePickArgs extends RitualSpellSpaceArgs {
  validTiles: RitualPickableTile[];
}

/**
 * @category Ritual
 */
export interface RitualSpellTagSpacePlacementArgs extends RitualSpellSpaceArgs {
  placeNum: number;
}

/**
 * @category Ritual
 */
export interface RitualSpellTagCollisionArgs extends RitualSpellDefaultArgs {
  collidedWith: FieldSpell;
}

/**
 * @category Ritual
 */
export interface RitualSpellTagCollisionSpaceArgs
  extends RitualSpellTagCollisionArgs {
  collisionX: number;
  collisionY: number;
}

/**
 * @category Ritual
 */
export interface RitualCharacterArgs extends RitualDefaultArgs {
  character: ActivePlayer;
}

/**
 * @category Ritual
 */
export interface RitualCharacterManaArgs extends RitualCharacterArgs {
  mana: number;
}

/**
 * @category Ritual
 */
export interface RitualCharacterHealthArgs extends RitualCharacterArgs {
  health: number;
}

/**
 * @category Ritual
 */
export interface RitualSpellCancelArgs extends RitualSpellDefaultArgs {
  canceledSpell: FieldSpell;
}

/**
 * @category Ritual
 */
export interface RitualSpellCanceledArgs extends RitualSpellDefaultArgs {
  canceledBySpell: FieldSpell;
}

/**
 * @category Ritual
 */
export interface RitualSpellDestroyArgs extends RitualSpellDefaultArgs {
  destroyedSpell: FieldSpell;
}

/**
 * @category Ritual
 */
export interface RitualSpellDestroyedArgs extends RitualSpellDefaultArgs {
  destroyedBySpell: FieldSpell;
}

/**
 * @category Ritual
 */
export interface RitualSpellDamageArgs extends RitualSpellDefaultArgs {
  damage: number;
}

/**
 * @category Ritual
 */
export interface RitualSpellTagChangeArgs extends RitualSpellDefaultArgs {
  tag: string;
  newValue: number;
}

/**
 * @category Ritual
 */
export interface RitualSpellStatChangeArgs extends RitualSpellDefaultArgs {
  stat: SpellStatImpl;
  oldValue: string | number;
  newValue: string | number;
}

/**
 * @category Ritual
 */
export interface RitualPhaseChangeArgs extends RitualDefaultArgs {
  newPhase: GamePhase;
  newTurn: TurnOrder;
}

/**
 * @category Ritual
 */
export interface RitualCurrentContextSpellArgs {
  spellContext: {
    spell: FieldSpell;
  };
}

/**
 * @category Ritual
 */
export interface RitualCurrentContextSpellTagArgs {
  spellTagContext: {
    id: string;
    key: string | undefined;
    stacks: number;
  };
}

/**
 * @category Ritual
 */
export interface RitualCurrentContextRelicArgs {
  relicContext: {
    id: string;
    key: string | undefined;
    stacks: number;
    owner: ActivePlayer;
  };
}

/**
 * @category Ritual
 */
export interface RitualCurrentContextStatusEffectArgs {
  statusEffectContext: {
    id: string;
    key: string | undefined;
    stacks: number;
    owner: ActivePlayer;
  };
}

/**
 * @category Ritual
 */
export interface RitualCurrentContextTileArgs {
  tileContext: {
    id: string;
    key: string | undefined;
    tileStatus: FieldStatus;
    x: number;
    y: number;
  };
}

/**
 * @category Ritual
 */
export type RitualCurrentContextArgs =
  | RitualCurrentContextSpellArgs
  | RitualCurrentContextSpellTagArgs
  | RitualCurrentContextRelicArgs
  | RitualCurrentContextStatusEffectArgs
  | RitualCurrentContextTileArgs;

export type RitualPickableTile = { nextX: number; nextY: number };
export type RitualReturn = void | boolean | RitualPickableTile[];
export type RitualReturnMulti = void | boolean[] | RitualPickableTile[][];

/**
 * @category Ritual
 * @category Modding
 */
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

  // additional spaces to consider for spell movement
  // OF NOTE: if a function returns anything, one of those tiles will be chosen
  // if multiple functions return arrays of tiles, one array will be chosen, then one tile from that array
  // ✅ implemented in moveSpellForwardOneStep
  onSpellPickMovementTiles(
    opts: RitualSpellSpacePickArgs,
    context?: RitualCurrentContextArgs,
  ): RitualPickableTile[];

  // whether or not a space can be entered
  // if any tag, spell, or relic returns false, the space cannot be entered
  // ✅ implemented in moveSpellToPosition
  onSpellSpaceEnter(
    opts: RitualSpellSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): boolean;

  // called after entering a space
  // ✅ implemented in moveSpellToPosition
  onSpellSpaceEntered(
    opts: RitualSpellSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // whether or not a space can be exited
  // if any tag, spell, or relic returns false, the space cannot be exited
  // ✅ implemented in moveSpellToPosition
  onSpellSpaceExit(
    opts: RitualSpellSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): boolean;

  // called after exiting a space
  // ✅ implemented in moveSpellToPosition
  onSpellSpaceExited(
    opts: RitualSpellSpaceArgs,
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
