export type ScoringType = "points_limit" | "rounds_limit" | "manual";

export interface Game {
  id: string;
  name: string;
  rules: {
    scoringType: ScoringType;
    limit?: number;
    winCondition: "highest" | "lowest";
  };
}

export interface Player {
  id: string;
  name: string;
}

export interface ScoreEntry {
  playerId: string;
  value: number;
  round: number;
}

export interface Session {
  id: string;
  gameId: string;
  players: Player[];
  scores: ScoreEntry[];
  currentRound: number;
  status: "active" | "finished";
  winners?: string[];
}
