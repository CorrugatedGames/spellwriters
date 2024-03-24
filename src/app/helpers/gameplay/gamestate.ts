import { signal, type Signal, type WritableSignal } from '@angular/core';
import { type CombatState, type CombatStateInitOpts } from '../../interfaces';
import { createBlankCombatState } from './init';

const _combatstate: WritableSignal<CombatState> = signal(
  createBlankCombatState(),
);

/**
 * @internal
 */
export const combatstate: Signal<CombatState> = _combatstate.asReadonly();

const _debugCombatstate: WritableSignal<CombatState> = signal(
  createBlankCombatState(),
);

/**
 * @internal
 */
export const debugCombatstate: Signal<CombatState> =
  _debugCombatstate.asReadonly();

/**
 * @internal
 */
export const combatstateInitOptions: WritableSignal<
  CombatStateInitOpts | undefined
> = signal(undefined);

/**
 * Save a state as the current game state.
 * You probably don't need to do this, but you might.
 *
 * @category Game State
 */
export function saveCombatstate(opts: { state: CombatState }): void {
  const { state } = opts;
  _combatstate.set(state);
}

/**
 * Trigger a game state update. This will save the current game state as the current game state.
 * You probably don't need to do this, but you might have to. In those cases, this function is provided.
 * However, using this function in a mod probably means that something internally isn't working as intended, and should probably be reported as a bug.
 *
 * @category Game State
 */
export function triggerCombatstateUpdate(): void {
  const currentState = combatstate();
  saveCombatstate({ state: { ...currentState } });
}

/**
 * Reset the game state to a blank state.
 *
 * @category Game State
 */
export function resetCombatstate(): void {
  _combatstate.set(createBlankCombatState());
}

/**
 * Save a state as the current debug game state. A debug state is loaded every time the phase is refreshed. Useful for testing content.
 * You'll probably use `storeCurrentStateAsDebugState` instead.
 *
 * @category Game State
 * @category Debug
 * @param opts.state The state to save as the debug state.
 */
export function saveDebugCombatstate(opts: { state: CombatState }): void {
  const { state } = opts;
  _debugCombatstate.set(state);
}

/**
 * Reset the debug game state to a blank state. Will make it so the debug state is not loaded on phase refresh.
 *
 * @category Game State
 * @category Debug
 */
export function resetDebugCombatstate(): void {
  _debugCombatstate.set(createBlankCombatState());
}

/**
 * Save the current game state as the debug game state. A debug state is loaded every time the phase is refreshed. Useful for testing content.
 *
 * @category Game State
 * @category Debug
 */
export function storeCurrentCombatStateAsDebugState(): void {
  saveDebugCombatstate({ state: combatstate() });
}
