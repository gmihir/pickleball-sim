import type { SimulationConfig, SimulationResults } from './types';

const SERVING_DISADVANTAGE = 0.5754; // 57.54% of the time, serving team loses the point 

export function runSimulation(config: SimulationConfig): SimulationResults {
  const {
    simulationCount,
    gameFormat,
    pointsPerGame,
    matchFormat,
    sideAdvantage,
    firstPointRule,
    players,
  } = config;

  let team1Strength: number;
  let team2Strength: number;

  if (gameFormat === 'singles') {
    team1Strength = players[0];
    team2Strength = players[0];
  } else {
    team1Strength = (players[0] + players[1]) / 2;
    team2Strength = (players[2] + players[3]) / 2;
  }

  let optimalServer: number | undefined = undefined;
  if (gameFormat === 'doubles') {
    optimalServer = players[0] >= players[1] ? 1 : 2;
  }

  let serveFirstWins = 0;
  let chooseSideWins = 0;

  for (let i = 0; i < simulationCount; i++) {
    const serveFirstResult = simulateMatch(
      team1Strength,
      team2Strength,
      pointsPerGame,
      matchFormat === 'bestOf3' ? 2 : 1,
      sideAdvantage,
      firstPointRule,
      true, // team 1 serves first
    );

    const serveFirstWin = serveFirstResult.winner === 1;
    if (serveFirstWin) {
      serveFirstWins++;
    }

    const chooseSideResult = simulateMatch(
      team1Strength,
      team2Strength,
      pointsPerGame,
      matchFormat === 'bestOf3' ? 2 : 1,
      sideAdvantage,
      firstPointRule,
      false, // team 2 serves first
    );

    const chooseSideWin = chooseSideResult.winner === 1;
    if (chooseSideWin) {
      chooseSideWins++;
    }
  }

  const serveFirstWinRate = serveFirstWins / simulationCount;
  const chooseSideWinRate = chooseSideWins / simulationCount;

  const recommendation =
    serveFirstWinRate > chooseSideWinRate ? 'Serve First' : 'Choose Side';

  return {
    simulationCount,
    recommendation,
    serveFirstWinRate,
    chooseSideWinRate,
    optimalServer: recommendation === 'Serve First' ? optimalServer : undefined,
  };
}

function simulateMatch(
  team1Strength: number,
  team2Strength: number,
  pointsToWin: number,
  winsNeeded: number,
  sideAdvantage: number,
  firstPointRule: boolean,
  team1ServesFirst: boolean,
): { winner: number; team1Score: number; team2Score: number } {
  let team1Wins = 0;
  let team2Wins = 0;
  let team1TotalScore = 0;
  let team2TotalScore = 0;

  while (team1Wins < winsNeeded && team2Wins < winsNeeded) {
    const gameResult = simulateGame(
      team1Strength,
      team2Strength,
      pointsToWin,
      sideAdvantage,
      firstPointRule,
      team1ServesFirst,
    );

    if (gameResult.winner === 1) {
      team1Wins++;
    } else {
      team2Wins++;
    }

    team1TotalScore += gameResult.team1Score;
    team2TotalScore += gameResult.team2Score;

    team1ServesFirst = !team1ServesFirst;
  }

  return {
    winner: team1Wins > team2Wins ? 1 : 2,
    team1Score: team1TotalScore,
    team2Score: team2TotalScore,
  };
}

function simulateGame(
  team1Strength: number,
  team2Strength: number,
  pointsToWin: number,
  sideAdvantage: number,
  firstPointRule: boolean,
  team1ServesFirst: boolean,
): { winner: number; team1Score: number; team2Score: number } {
  let team1Score = 0;
  let team2Score = 0;
  let team1Serving = team1ServesFirst;

  if (firstPointRule) {
    if (team1Serving) {
      team2Score++;
    } else {
      team1Score++;
    }
    team1Serving = !team1Serving;
  }

  while (true) {
    if (
      (team1Score >= pointsToWin || team2Score >= pointsToWin) &&
      Math.abs(team1Score - team2Score) >= 2
    ) {
      break;
    }

    const team1WinProb = calculatePointWinProbability(
      team1Strength,
      team2Strength,
      team1Serving,
      sideAdvantage,
    );

    if (Math.random() < team1WinProb) {
      team1Score++;
      if (!team1Serving) {
        team1Serving = true;
      }
    } else {
      team2Score++;
      if (team1Serving) {
        team1Serving = false;
      }
    }
  }

  return {
    winner: team1Score > team2Score ? 1 : 2,
    team1Score,
    team2Score,
  };
}

function calculatePointWinProbability(
  team1Strength: number,
  team2Strength: number,
  team1Serving: boolean,
  sideAdvantage: number,
): number {
  // P(win) = 1 / (1 + 10^((opponent - player) / scale))
  // this is ripped off from chess elo calculations lol
  const scale = 1.0;
  let baseProb = 1 / (1 + Math.pow(10, (team2Strength - team1Strength) / scale));

  if (team1Serving) {
    baseProb -= (SERVING_DISADVANTAGE - 0.5);
  } else {
    baseProb += (SERVING_DISADVANTAGE - 0.5);
  }

  const sideEffect = sideAdvantage * 0.01;
  baseProb += sideEffect;

  return Math.max(0.05, Math.min(0.95, baseProb));
}