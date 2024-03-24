import type { GameFeature } from '../../interfaces';
import { gameState, saveGameState } from './gamestate';

/**
 * Change the active game feature.
 *
 * @param feature the feature to change to
 */
export function changeFeature(feature: GameFeature) {
  saveGameState({
    state: {
      ...gameState(),
      currentFeature: feature,
    },
  });
}

/**
 * Move to the next stage.
 */
export function nextStage() {
  saveGameState({
    state: {
      ...gameState(),
      currentStage: gameState().currentStage + 1,
    },
  });
}

/**
 * Move to the next act.
 */
export function nextAct() {
  saveGameState({
    state: {
      ...gameState(),
      currentAct: gameState().currentAct + 1,
      currentStage: 0,
    },
  });
}
