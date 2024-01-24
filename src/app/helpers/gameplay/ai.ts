import {
  AIOpts,
  AIPattern,
  ActivePlayer,
  GamePhase,
  TurnOrder,
} from '../../interfaces';
import { nextPhase } from './meta';
import { gamestate } from './signal';
import { drawCard } from './turn';

import * as Behaviors from './ai-patterns';
import { canPlayCardsInHand, playableCardsInHand } from './hand';
import { seededrng, weighted } from './rng';

const AllBehaviors: Record<string, AIPattern> = Behaviors;

export function getAIOpts(): AIOpts {
  const state = gamestate();

  return {
    gamestate: state,
    prng: seededrng(),
    playableCards: playableCardsInHand(state.players[TurnOrder.Opponent]),
  };
}

export function aiAttemptAction(): void {
  const state = gamestate();

  if (state.currentTurn === TurnOrder.Player) return;

  const aiPlayer = state.players[TurnOrder.Opponent];

  switch (state.currentPhase) {
    case GamePhase.Draw:
      aiDrawPhase(aiPlayer);
      break;

    case GamePhase.Turn:
      aiSpendPhase(aiPlayer);
      break;

    case GamePhase.End:
      aiEndPhase();
      break;
  }
}

export function aiDrawPhase(character: ActivePlayer): void {
  drawCard(character);
  nextPhase();
}

export function aiSpendPhase(character: ActivePlayer): void {
  let numDecisions = 0;
  while (numDecisions++ < 100 && canPlayCardsInHand(character)) {
    try {
      const aiOpts = getAIOpts();
      const applicableBehaviors = Object.keys(character.behaviors).filter((b) =>
        AllBehaviors[b]?.canMakeDecision(aiOpts),
      );
      if (applicableBehaviors.length === 0) break;

      const behaviorWeights = applicableBehaviors.reduce((acc, cur) => {
        acc[cur] = character.behaviors[cur];
        return acc;
      }, {} as Record<string, number>);

      const chosenBehavior = weighted(behaviorWeights);

      const behavior = AllBehaviors[chosenBehavior];

      behavior.makeDecision(aiOpts);
    } catch (e) {
      console.error(e);
      break;
    }
  }

  nextPhase();
}

export function aiEndPhase(): void {
  nextPhase();
}
