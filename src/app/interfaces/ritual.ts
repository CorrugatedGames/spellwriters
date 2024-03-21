import { type ActivePlayer, type GamePhase, type TurnOrder } from './gamestate';
import { type FieldSpell, type Spell, type SpellStatType } from './spell';
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
export interface RitualSpellCollisionArgs extends RitualSpellDefaultArgs {
  collidedWith: FieldSpell;
}

/**
 * @category Ritual
 */
export interface RitualSpellCollisionSpaceArgs
  extends RitualSpellCollisionArgs {
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
  stat: SpellStatType;
  oldValue: string | number;
  newValue: string | number;
}

/**
 * @category Ritual
 */
export interface RitualPhaseChangeArgs extends RitualDefaultArgs {
  oldPhase: GamePhase;
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
  /**
   * Fired before placing a spell on the field.
   *
   * @remarks implemented in `getTargettableSpacesForSpellAroundPosition`
   * @param opts
   * @param context
   */
  onSpellPlace(
    opts: RitualSpellPlaceCheckArgs,
    context?: RitualCurrentContextArgs,
  ): boolean;

  /**
   * Fired once per space the spell is placed in (for example, wider spells)
   *
   * @remarks implemented in `handleEntireSpellcastSequence`
   * @param opts
   * @param context
   */
  onSpellPlaced(
    opts: RitualSpellTagSpacePlacementArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when a spell is removed from the field.
   *
   * @remarks implemented in `removeSpellFromField`
   * @param opts
   * @param context
   */
  onSpellRemoved(
    opts: RitualSpellDefaultArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired if the spell cancels the casting of another spell.
   *
   * @remarks implemented in `spellCollisionDamageReduction`
   * @param opts
   * @param context
   */
  onSpellCancel(
    opts: RitualSpellCancelArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired if the spell is canceled while casting.
   *
   * @remarks implemented in `spellCollisionDamageReduction`
   * @param opts
   * @param context
   */
  onSpellCanceled(
    opts: RitualSpellCanceledArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when the attached spell destroys another spell
   *
   * @remarks implemented in `spellCollisionDamageReduction`
   * @param opts
   * @param context
   */
  onSpellDestroy(
    opts: RitualSpellDestroyArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired once per spell instance destroyed.
   *
   * @remarks implemented in `spellCollisionDamageReduction`
   * @param opts
   * @param context
   */
  onSpellDestroyed(
    opts: RitualSpellDestroyedArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired once per spell dealing damage to the opponent.
   *
   * @remarks implemented in `moveSpellToPosition`
   * @param opts
   * @param context
   */
  onSpellDealDamage(
    opts: RitualSpellDamageArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when attempting to pick spaces for a spell to move to.
   * This function returns a unique array per spell for *each* possible tile that the spell can move to.
   * If a function returns an array of items (length 0 does not count), one of those arrays will be chosen, and further one of the tiles from that chosen array will be chosen to move to.
   *
   * @remarks implemented in `moveSpellForwardOneStep`
   * @param opts
   * @param context
   * @returns {RitualPickableTile[]} the tiles that the spell can move to
   */
  onSpellPickMovementTiles(
    opts: RitualSpellSpacePickArgs,
    context?: RitualCurrentContextArgs,
  ): RitualPickableTile[];

  /**
   * Fired when attempting to enter a new space.
   * If anything returns false, the spell cannot enter the space.
   *
   * @remarks implemented in `moveSpellToPosition`
   * @param opts
   * @param context
   * @returns {boolean} whether or not the spell can enter the space
   */
  onSpellSpaceEnter(
    opts: RitualSpellSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): boolean;

  /**
   * Fired when a spell has entirely entered a space.
   *
   * @remarks implemented in `moveSpellToPosition`
   * @param opts
   * @param context
   */
  onSpellSpaceEntered(
    opts: RitualSpellSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when attempting to leave the current space.
   * If anything returns false, the spell cannot leave the space.
   *
   * @remarks implemented in `moveSpellToPosition`
   * @param opts
   * @param context
   * @returns {boolean} whether or not the spell can leave the space
   */
  onSpellSpaceExit(
    opts: RitualSpellSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): boolean;

  /**
   * Fired when a spell has entirely left a space.
   *
   * @remarks implemented in `moveSpellToPosition`
   * @param opts
   * @param context
   */
  onSpellSpaceExited(
    opts: RitualSpellSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when before a collision between two spells happens.
   *
   * @remarks implemented in `moveSpellToPosition`
   * @param opts
   * @param context
   */
  onSpellCollision(
    opts: RitualSpellCollisionSpaceArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when a spell wins a collision with another spell.
   *
   * @remarks implemented in `defaultCollisionWinner`
   * @param opts
   * @param context
   */
  onSpellCollisionWin(
    opts: RitualSpellCollisionArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when a spell loses a collision with another spell.
   *
   * @remarks implemented in `defaultCollisionWinner`
   * @param opts
   * @param context
   */
  onSpellCollisionLose(
    opts: RitualSpellCollisionArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when a spell ties a collision with another spell.
   *
   * @remarks implemented in `defaultCollisionWinner`
   * @param opts
   * @param context
   */
  onSpellCollisionTie(
    opts: RitualSpellCollisionArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when a spells stat changes.
   *
   * @remarks implemented in `setSpellStat`
   * @param opts
   * @param context
   */
  onSpellStatChange(
    opts: RitualSpellStatChangeArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  // ✅ implemented in

  /**
   * Fired when a spell tag changes in value.
   *
   * @remarks implemented in `setSpellTag`
   * @param opts
   * @param context
   */
  onSpellTagChange(
    opts: RitualSpellTagChangeArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when combat starts.
   * This is a nice wrapper around the `onCombatPhaseChange` function.
   *
   * @remarks implemented in `nextPhase`
   * @param opts
   * @param context
   */
  onCombatStart(
    opts: RitualDefaultArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when combat ends.
   * This is a nice wrapper around the `onCombatPhaseChange` function.
   *
   * @remarks implemented in `nextPhase`
   * @param opts
   * @param context
   */
  onCombatFinish(
    opts: RitualDefaultArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when the combat phase changes.
   *
   * @remarks implemented in `nextPhase`
   * @param opts
   * @param context
   */
  onCombatPhaseChange(
    opts: RitualPhaseChangeArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when any player gains any mana.
   *
   * @remarks implemented in `gainMana`
   * @param opts
   * @param context
   */
  onPlayerGainMana(
    opts: RitualCharacterManaArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when any player loses any mana (including spending it).
   *
   * @remarks implemented in `loseMana`
   * @param opts
   * @param context
   */
  onPlayerLoseMana(
    opts: RitualCharacterManaArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when any player gains any health.
   *
   * @remarks implemented in `gainHealth`
   * @param opts
   * @param context
   */
  onPlayerGainHealth(
    opts: RitualCharacterHealthArgs,
    context?: RitualCurrentContextArgs,
  ): void;

  /**
   * Fired when any player loses any health.
   *
   * @remarks implemented in `loseHealth`
   * @param opts
   * @param context
   */
  onPlayerLoseHealth(
    opts: RitualCharacterHealthArgs,
    context?: RitualCurrentContextArgs,
  ): void;
}
