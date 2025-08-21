export interface SimulationConfig {
  simulationCount: number;
  gameFormat: 'singles' | 'doubles';
  pointsPerGame: number;
  matchFormat: 'bestOf1' | 'bestOf3';
  sideAdvantage: number;
  firstPointRule: boolean;
  players: number[];
}

export interface SimulationResults {
  simulationCount: number;
  recommendation: 'Serve First' | 'Choose Side';
  serveFirstWinRate: number;
  chooseSideWinRate: number;
  optimalServer?: number;
}