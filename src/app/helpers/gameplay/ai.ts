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

import { seededrng, weighted } from '../static/rng';
import { DEFAULT_DELAY, delay } from '../static/time';
import * as Behaviors from './ai-patterns';
import { canPlayCardsInHand, playableCardsInHand } from './hand';

const AllBehaviors: Record<string, AIPattern> = Behaviors;

export function getAIOpts(): AIOpts {
  const state = gamestate();

  return {
    gamestate: state,
    rng: seededrng(),
    playableCards: playableCardsInHand({
      player: state.players[TurnOrder.Opponent],
    }),
  };
}

export async function aiAttemptAction(): Promise<void> {
  const state = gamestate();

  if (state.currentTurn === TurnOrder.Player) return;

  const aiPlayer = state.players[TurnOrder.Opponent];

  switch (state.currentPhase) {
    case GamePhase.Draw:
      await aiDrawPhase({ character: aiPlayer });
      break;

    case GamePhase.Turn:
      await aiSpendPhase({ character: aiPlayer });
      break;

    case GamePhase.End:
      await aiEndPhase();
      break;
  }
}

export async function aiDrawPhase(opts: {
  character: ActivePlayer;
}): Promise<void> {
  const { character } = opts;

  drawCard(character);
  await delay(DEFAULT_DELAY);
  await nextPhase();
}

export async function aiSpendPhase(opts: {
  character: ActivePlayer;
}): Promise<void> {
  const { character } = opts;

  let numDecisions = 0;
  while (numDecisions++ < 100 && canPlayCardsInHand({ player: character })) {
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

  await delay(DEFAULT_DELAY);
  await nextPhase();
}

export async function aiEndPhase(): Promise<void> {
  await delay(DEFAULT_DELAY);
  await nextPhase();
}
