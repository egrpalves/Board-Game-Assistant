import React, { useState } from "react";
import { useSessionStore } from "../../../store/sessionStore";
import styles from "./RoundHistoryEditor.module.scss";

interface RoundHistoryEditorProps {
  onClose: () => void;
  selectedRound?: number;
}

export const RoundHistoryEditor: React.FC<RoundHistoryEditorProps> = ({
  onClose,
  selectedRound,
}) => {
  const { session, updateRoundScore } = useSessionStore();
  const [editingCell, setEditingCell] = useState<{
    playerId: string;
    round: number;
  } | null>(null);
  const [editValue, setEditValue] = useState<number | string>("");
  const [currentRound, setCurrentRound] = useState(selectedRound || 1);

  if (!session) return null;

  // Organizar scores por ronda
  const roundsData = new Map<number, Record<string, number>>();
  session.scores.forEach((entry) => {
    if (!roundsData.has(entry.round)) {
      roundsData.set(entry.round, {});
    }
    roundsData.get(entry.round)![entry.playerId] = entry.value;
  });

  const rounds = Array.from(roundsData.keys()).sort((a, b) => a - b);
  const isSingleRoundMode = selectedRound !== undefined;

  const handleCellClick = (playerId: string, round: number, value: number) => {
    setEditingCell({ playerId, round });
    setEditValue(value);
  };

  const handleSaveEdit = () => {
    if (editingCell && editValue !== "") {
      updateRoundScore(
        editingCell.playerId,
        editingCell.round,
        parseInt(String(editValue)) || 0,
      );
      setEditingCell(null);
      setEditValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      setEditingCell(null);
      setEditValue("");
    }
  };

  const navigateRound = (direction: "prev" | "next") => {
    const currentIndex = rounds.indexOf(currentRound);
    if (direction === "prev" && currentIndex > 0) {
      setCurrentRound(rounds[currentIndex - 1]);
    } else if (direction === "next" && currentIndex < rounds.length - 1) {
      setCurrentRound(rounds[currentIndex + 1]);
    }
  };

  const displayRounds = isSingleRoundMode ? [currentRound] : rounds;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>
            {isSingleRoundMode
              ? `Editar Ronda ${currentRound}`
              : "Histórico de Rondas"}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {isSingleRoundMode && rounds.length > 1 && (
          <div className={styles.roundNavigation}>
            <button
              className={styles.navBtn}
              onClick={() => navigateRound("prev")}
              disabled={rounds.indexOf(currentRound) === 0}
            >
              ← Anterior
            </button>
            <span className={styles.roundInfo}>
              Ronda {currentRound} de {rounds.length}
            </span>
            <button
              className={styles.navBtn}
              onClick={() => navigateRound("next")}
              disabled={rounds.indexOf(currentRound) === rounds.length - 1}
            >
              Próxima →
            </button>
          </div>
        )}

        <div className={styles.tableWrapper}>
          {isSingleRoundMode ? (
            <div className={styles.playerList}>
              {session.players.map((player) => {
                const value = roundsData.get(currentRound)?.[player.id] ?? 0;
                const isEditing =
                  editingCell?.playerId === player.id &&
                  editingCell?.round === currentRound;

                return (
                  <div
                    key={player.id}
                    className={styles.playerItem}
                    onClick={() =>
                      handleCellClick(player.id, currentRound, value)
                    }
                  >
                    <span className={styles.playerName}>{player.name}</span>
                    <div className={styles.playerValueContainer}>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={handleSaveEdit}
                          onKeyDown={handleKeyDown}
                          className={styles.editInput}
                        />
                      ) : (
                        <span className={styles.scoreValue}>{value}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ronda</th>
                  {session.players.map((player) => (
                    <th key={player.id}>{player.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayRounds.map((round) => (
                  <tr key={round}>
                    <td className={styles.roundCell}>{round}</td>
                    {session.players.map((player) => {
                      const value = roundsData.get(round)?.[player.id] ?? 0;
                      const isEditing =
                        editingCell?.playerId === player.id &&
                        editingCell?.round === round;

                      return (
                        <td
                          key={player.id}
                          className={styles.scoreCell}
                          onClick={() =>
                            handleCellClick(player.id, round, value)
                          }
                        >
                          <div className={styles.playerScoreRow}>
                            {isEditing ? (
                              <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={handleSaveEdit}
                                onKeyDown={handleKeyDown}
                                className={styles.editInput}
                              />
                            ) : (
                              <span className={styles.scoreValue}>{value}</span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className={styles.footer}>
          <p className={styles.hint}>Clique em qualquer valor para editar</p>
          <button className={styles.closeButton} onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
