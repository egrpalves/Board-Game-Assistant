import React, { useState } from "react";
import { useSessionStore } from "../../../store/sessionStore";
import { Game } from "../../../domain/models";
import { GameEngine } from "../../../app/engine";
import { RoundHistoryEditor } from "../RoundHistoryEditor/RoundHistoryEditor";
import styles from "./GameTable.module.scss";
import { EndGameModal } from "../EndGameModal/EndGameModal";

export const GameTable: React.FC<{ game: Game }> = ({ game }) => {
  const { session, submitRound, forceEndGame } = useSessionStore();
  const [roundInputs, setRoundInputs] = useState<Record<string, number>>({});
  const [showRoundHistory, setShowRoundHistory] = useState(false);
  const [selectedRound, setSelectedRound] = useState<number | undefined>();

  if (!session) return null;

  const totals = GameEngine.calculateTotals(session);

  // Get all played rounds
  const roundsData = new Map<number, Record<string, number>>();
  session.scores.forEach((entry) => {
    if (!roundsData.has(entry.round)) {
      roundsData.set(entry.round, {});
    }
    roundsData.get(entry.round)![entry.playerId] = entry.value;
  });
  const playedRounds = Array.from(roundsData.keys()).sort((a, b) => a - b);

  const handleFinishRound = () => {
    // Garante que todos os jogadores têm um valor (mesmo que 0)
    const scores = session.players.reduce(
      (acc, p) => ({
        ...acc,
        [p.id]: roundInputs[p.id] || 0,
      }),
      {},
    );

    submitRound(scores, game);
    setRoundInputs({}); // Limpa inputs para a próxima ronda
  };

  const handleRoundClick = (round: number) => {
    setSelectedRound(round);
    setShowRoundHistory(true);
  };

  return (
    <div className={styles.wrapper}>
      {showRoundHistory && (
        <RoundHistoryEditor
          onClose={() => {
            setShowRoundHistory(false);
            setSelectedRound(undefined);
          }}
          selectedRound={selectedRound}
        />
      )}

      <div className={styles.gameInfo}>
        <h1>{game.name}</h1>
        <p>
          Ronda Atual: <strong>{session.currentRound}</strong>
        </p>

        {playedRounds.length > 0 && (
          <div className={styles.roundCounter}>
            {playedRounds.map((round) => (
              <button
                key={round}
                className={styles.roundTab}
                onClick={() => handleRoundClick(round)}
                title={`Clique para editar ronda ${round}`}
              >
                {round}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.scoreGrid}>
        {session.players.map((player) => (
          <div key={player.id} className={styles.playerRow}>
            <div className={styles.playerInfo}>
              <span className={styles.playerName}>{player.name}</span>
              <span className={styles.playerTotal}>
                Total: {totals.find((t) => t.playerId === player.id)?.total} pts
              </span>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Pontos nesta ronda"
                value={roundInputs[player.id] || ""}
                onChange={(e) =>
                  setRoundInputs({
                    ...roundInputs,
                    [player.id]: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button className={styles.primaryBtn} onClick={handleFinishRound}>
          Terminar Ronda {session.currentRound}
        </button>

        <button
          className={styles.secondaryBtn}
          onClick={() => forceEndGame(game)}
        >
          Terminar Jogo Manualmente
        </button>
      </div>

      {session.status === "finished" && <EndGameModal game={game} />}
    </div>
  );
};
