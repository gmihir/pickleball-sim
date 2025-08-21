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
  
  let yourTeamStrength: number;
  let opponentsStrength: number;

  if (gameFormat === 'singles') {
    yourTeamStrength = players[0];
    opponentsStrength = players[1];
  } else {
    yourTeamStrength = (players[0] + players[1]) / 2;
    opponentsStrength = (players[2] + players[3]) / 2;
  }

  let serveFirstWins = 0;
  let chooseSideWins = 0;

  for (let i = 0; i < simulationCount; i++) {
    const serveFirstResult = simulateMatch(
      yourTeamStrength,
      opponentsStrength,
      pointsPerGame,
      matchFormat === 'bestOf3' ? 2 : 1,
      Math.abs(sideAdvantage),
      firstPointRule,
      true,
      gameFormat,
    );
    if (serveFirstResult.winner === 1) {
      serveFirstWins++;
    }

    const chooseSideResult = simulateMatch(
      yourTeamStrength,
      opponentsStrength,
      pointsPerGame,
      matchFormat === 'bestOf3' ? 2 : 1,
      -Math.abs(sideAdvantage),
      firstPointRule,
      false,
      gameFormat,
    );
    if (chooseSideResult.winner === 1) {
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
    chooseSideWinRate
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
  gameFormat: 'singles' | 'doubles',
): { winner: number; } {
  let team1Wins = 0;
  let team2Wins = 0;
  let team1TotalScore = 0;
  let team2TotalScore = 0;

  let gameNum = 0;
  
  while (team1Wins < winsNeeded && team2Wins < winsNeeded) {
    gameNum++;
    
    const maxPossibleGames = winsNeeded * 2 - 1;
    const isLastGame = gameNum === maxPossibleGames;
    
    const gameResult = simulateGame(
      team1Strength,
      team2Strength,
      pointsToWin,
      sideAdvantage,
      firstPointRule,
      team1ServesFirst,
      isLastGame,
      gameFormat,
    );

    if (gameResult.winner === 1) {
      team1Wins++;
    } else {
      team2Wins++;
    }

    team1TotalScore += gameResult.team1Score;
    team2TotalScore += gameResult.team2Score;

    if (team1Wins < winsNeeded && team2Wins < winsNeeded) {
      team1ServesFirst = !team1ServesFirst;
      sideAdvantage = -sideAdvantage;
    }
  }

  return {
    winner: team1Wins > team2Wins ? 1 : 2
  };
}

function simulateGame(
  team1Strength: number,
  team2Strength: number,
  pointsToWin: number,
  sideAdvantage: number,
  automaticallyLoseFirstPoint: boolean,
  team1ServesFirst: boolean,
  flipSideAtHalfway: boolean,
  gameFormat: 'singles' | 'doubles',
): { winner: number; team1Score: number; team2Score: number } {

  let team1Score = 0;
  let team2Score = 0;
  let team1Serving = team1ServesFirst;
  let currentSideAdvantage = sideAdvantage;
  const halfway = Math.ceil(pointsToWin / 2);
  let sideSwitched = false;

  let server = team1ServesFirst ? 1 : 3;


  if (automaticallyLoseFirstPoint) {
    if (team1Serving) {
      team2Score++;        
      team1Serving = false; 
    } else {
      team1Score++;
      team1Serving = true;
    }

    if(server === 1) {
      server = 3;
    }
    else {
      server = 1;
    }
  }

  if (gameFormat === 'singles') {
    while (true) {
      if (
        (team1Score >= pointsToWin || team2Score >= pointsToWin) &&
        Math.abs(team1Score - team2Score) >= 2
      ) {
        break;
      }

      if (flipSideAtHalfway && !sideSwitched && (team1Score >= halfway || team2Score >= halfway)) {
        currentSideAdvantage = -currentSideAdvantage;
        sideSwitched = true;
      }

      const team1WinProb = calculatePointWinProbability(
        team1Strength,
        team2Strength,
        team1Serving,
        currentSideAdvantage,
      );

      const pointWonByTeam1 = Math.random() < team1WinProb;

      if (team1Serving) {
        if (pointWonByTeam1) {
          team1Score++;
        } else {
          team1Serving = false;
        }
      } else {
        if (!pointWonByTeam1) {
          team2Score++;
        } else {
          team1Serving = true;
        }
      }
    }
  } else {
    while (true) {
      if (
        (team1Score >= pointsToWin || team2Score >= pointsToWin) &&
        Math.abs(team1Score - team2Score) >= 2
      ) {
        break;
      }

      if (flipSideAtHalfway && !sideSwitched && (team1Score >= halfway || team2Score >= halfway)) {
        currentSideAdvantage = -currentSideAdvantage;
        sideSwitched = true;
      }

      const team1IsServing = server === 1 || server === 2;
      const team1WinProb = calculatePointWinProbability(
        team1Strength,
        team2Strength,
        team1IsServing,
        currentSideAdvantage,
      );

      const pointWonByTeam1 = Math.random() < team1WinProb;

      if (server === 1) { // team1 first server
        if (pointWonByTeam1) {
          team1Score++;
        } else {
          server = 2; // go to team1 second server
        }
      } else if (server === 2) { // team1 second server
        if (pointWonByTeam1) {
          team1Score++;
        } else {
          server = 3; // go to team2 first server
        }
      } else if (server === 3) { // team2 first server
        if (!pointWonByTeam1) { // team2 wins
          team2Score++;
        } else {
          server = 4; // go to team2 second server
        }
      } else if (server === 4) { // team2 second server
        if (!pointWonByTeam1) { // team2 wins
          team2Score++;
        } else {
          server = 1; // back to team1 first server
        }
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
  const scale = 1.0;
  let baseProb = 1 / (1 + Math.pow(10, (team2Strength - team1Strength) / scale));

  const sideEffect = sideAdvantage * 0.01;
  baseProb += sideEffect;

  const SERVING_PENALTY = SERVING_DISADVANTAGE - 0.50; 
  if (team1Serving) {
    baseProb -= SERVING_PENALTY;
  } else {
    baseProb += SERVING_PENALTY;
  }

  return Math.max(0.05, Math.min(0.95, baseProb));
}