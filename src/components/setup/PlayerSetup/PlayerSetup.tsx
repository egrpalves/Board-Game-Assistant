import React from "react";
import { Game } from "../../../domain/models";
import { useSessionStore } from "../../../store/sessionStore";
import styles from "./PlayerSetup.module.scss";
import { Plus, Trash2, Play } from "lucide-react";
import { useBoardGame } from "../../../hooks/useBoardGame";

interface Props {
  game: Game;
  onCancel: () => void;
}

export const PlayerSetup: React.FC<Props> = ({ game, onCancel }) => {
  const { createSession } = useSessionStore();
  const { players, setPlayers } = useBoardGame();

  const addPlayer = () =>
    setPlayers([...players, `Jogador ${players.length + 1}`]);

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updateName = (index: number, name: string) => {
    const newNames = [...players];
    newNames[index] = name;
    setPlayers(newNames);
  };

  const handleStart = () => {
    const validNames = players.filter((n) => n.trim() !== "");
    if (validNames.length >= 2) {
      createSession(game, validNames);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Quem vai jogar {game.name}?</h2>

      <div className={styles.list}>
        {players.map((name, index) => (
          <div key={index} className={styles.inputGroup}>
            <input
              type="text"
              value={name}
              placeholder="Nome do jogador"
              onChange={(e) => updateName(index, e.target.value)}
            />
            <button
              className={styles.removeBtn}
              onClick={() => removePlayer(index)}
              disabled={players.length <= 2}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      <div className={styles.actions}>
        <button className={styles.addBtn} onClick={addPlayer}>
          <Plus size={20} /> Adicionar Jogador
        </button>

        <div className={styles.footerActions}>
          <button className={styles.startBtn} onClick={handleStart}>
            <Play size={20} fill="currentColor" /> Começar Jogo
          </button>
        </div>
      </div>
    </div>
  );
};
