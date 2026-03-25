import React from "react";
import { useSessionStore } from "../../../store/sessionStore";
import { GameEngine } from "../../../app/engine";
import { Game } from "../../../domain/models";
import styles from "./EndGameModal.module.scss";

export const EndGameModal: React.FC<{ game: Game }> = ({ game }) => {
  const { session, resetSession } = useSessionStore();
  if (!session) return null;

  const totals = GameEngine.calculateTotals(session);

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <h2>Fim de Jogo!</h2>
        <div className={styles.resultsList}>
          {totals
            .sort((a, b) => b.total - a.total)
            .map((result, index) => {
              const player = session.players.find(
                (p) => p.id === result.playerId,
              );
              const isWinner = session.winners?.includes(result.playerId);

              return (
                <div
                  key={result.playerId}
                  className={`${styles.resultItem} ${isWinner ? styles.winner : ""}`}
                >
                  <span className={styles.rank}>#{index + 1}</span>
                  <span className={styles.name}>
                    {player?.name} {isWinner ? "🏆" : ""}
                  </span>
                  <span className={styles.finalScore}>{result.total} pts</span>
                </div>
              );
            })}
        </div>

        <div className={styles.stats}>
          <p>Total de Rondas: {session.currentRound - 1}</p>
        </div>

        <button onClick={resetSession} className={styles.closeBtn}>
          Nova Sessão
        </button>
      </div>
    </div>
  );
};
