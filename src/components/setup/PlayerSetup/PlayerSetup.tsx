import React, { useState } from "react";
import { Game } from "../../../domain/models";
import { useSessionStore } from "../../../store/sessionStore";
import styles from "./PlayerSetup.module.scss";
import { Plus, Trash2, Play } from "lucide-react";

interface Props {
  game: Game;
  onCancel: () => void;
}

export const PlayerSetup: React.FC<Props> = ({ game, onCancel }) => {
  const { createSession } = useSessionStore();
  const [playerNames, setPlayerNames] = useState<string[]>([
    "Jogador 1",
    "Jogador 2",
  ]);

  const addPlayer = () =>
    setPlayerNames([...playerNames, `Jogador ${playerNames.length + 1}`]);

  const removePlayer = (index: number) => {
    if (playerNames.length > 2) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updateName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStart = () => {
    const validNames = playerNames.filter((n) => n.trim() !== "");
    if (validNames.length >= 2) {
      createSession(game, validNames);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Quem vai jogar {game.name}?</h2>

      <div className={styles.list}>
        {playerNames.map((name, index) => (
          <div key={index} className={styles.inputGroup}>
            <input
              type="text"
              value={name}
              placeholder="Nome do jogador"
              onChange={(e) => updateName(index, e.target.value)}
              autoFocus={index === playerNames.length - 1}
            />
            <button
              className={styles.removeBtn}
              onClick={() => removePlayer(index)}
              disabled={playerNames.length <= 2}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <button className={styles.addBtn} onClick={addPlayer}>
        <Plus size={20} /> Adicionar Jogador
      </button>

      <div className={styles.footerActions}>
        <button className={styles.startBtn} onClick={handleStart}>
          <Play size={20} fill="currentColor" /> Começar Jogo
        </button>
      </div>
    </div>
  );
};
