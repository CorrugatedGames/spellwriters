import { signal, type Signal, type WritableSignal } from '@angular/core';
import { type CombatState, type CombatStateInitOpts } from '../../interfaces';
import { createBlankCombatState } from './init';

const _combatstate: WritableSignal<CombatState> = signal(
  createBlankCombatState(),
);

/**
 * @internal
 */
export const combatState: Signal<CombatState> = _combatstate.asReadonly();

const _debugCombatState: WritableSignal<CombatState> = signal(
  createBlankCombatState(),
);

/**
 * @internal
 */
export const debugCombatState: Signal<CombatState> =
  _debugCombatState.asReadonly();

/**
 * @internal
 */
export const combatstateInitOptions: WritableSignal<
  CombatStateInitOpts | undefined
> = signal(undefined);

/**
 * Save a state as the current combat state.
 * You probably don't need to do this, but you might.
 *
 * @category Combat State
 */
export function saveCombatState(opts: { state: CombatState }): void {
  const { state } = opts;
  _combatstate.set(state);
}

/**
 * Trigger a combat state update. This will save the current combat state as the current combat state.
 * You probably don't need to do this, but you might have to. In those cases, this function is provided.
 * However, using this function in a mod probably means that something internally isn't working as intended, and should probably be reported as a bug.
 *
 * @category Combat State
 */
export function triggerCombatStateUpdate(): void {
  const currentState = combatState();
  saveCombatState({ state: { ...currentState } });
}

/**
 * Reset the combat state to a blank state.
 *
 * @category Combat State
 */
export function resetCombatState(): void {
  _combatstate.set(createBlankCombatState());
}

/**
 * Save a state as the current debug combat state. A debug state is loaded every time the phase is refreshed. Useful for testing content.
 * You'll probably use `storeCurrentStateAsDebugState` instead.
 *
 * @category Combat State
 * @category Debug
 * @param opts.state The state to save as the debug state.
 */
export function saveDebugCombatState(opts: { state: CombatState }): void {
  const { state } = opts;
  _debugCombatState.set(state);
}

/**
 * Reset the debug combat state to a blank state. Will make it so the debug state is not loaded on phase refresh.
 *
 * @category Combat State
 * @category Debug
 */
export function resetDebugCombatState(): void {
  _debugCombatState.set(createBlankCombatState());
}

/**
 * Save the current combat state as the debug combat state. A debug state is loaded every time the phase is refreshed. Useful for testing content.
 *
 * @category Combat State
 * @category Debug
 */
export function storeCurrentCombatStateAsDebugState(): void {
  saveDebugCombatState({ state: combatState() });
}
