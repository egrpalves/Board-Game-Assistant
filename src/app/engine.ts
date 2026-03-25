import { Session, Game, Player } from "../domain/models";

export interface EngineResult {
  isFinished: boolean;
  winners: string[]; // Mantemos IDs para consistência com o estado da Session
}

export const GameEngine = {
  /**
   * Calcula o somatório de pontos por jogador
   */
  calculateTotals: (session: Session) => {
    return session.players.map((player: Player) => ({
      playerId: player.id,
      playerName: player.name, // Agora usamos o modelo Player explicitamente
      total: session.scores
        .filter((s) => s.playerId === player.id)
        .reduce((sum, s) => sum + s.value, 0),
    }));
  },

  /**
   * Avalia se as condições de vitória do jogo foram atingidas
   */
  checkGameEnd: (session: Session, game: Game): EngineResult => {
    const totals = GameEngine.calculateTotals(session);
    const { rules } = game;
    let isFinished = false;

    // 1. Verificação por Limite de Pontos
    if (rules.scoringType === "points_limit" && rules.limit) {
      isFinished = totals.some((t) => t.total >= rules.limit!);
    }

    // 2. Verificação por Limite de Rondas
    if (rules.scoringType === "rounds_limit" && rules.limit) {
      // Se a última ronda registada for igual ou superior ao limite
      if (session.currentRound > rules.limit) {
        isFinished = true;
      }
    }

    // Determinar IDs dos vencedores com base na Win Condition
    let winners: string[] = [];

    if (isFinished || session.status === "finished") {
      const allScores = totals.map((t) => t.total);
      const targetScore =
        rules.winCondition === "highest"
          ? Math.max(...allScores)
          : Math.min(...allScores);

      winners = totals
        .filter((t) => t.total === targetScore)
        .map((t) => t.playerId);
    }

    return { isFinished, winners };
  },
};
