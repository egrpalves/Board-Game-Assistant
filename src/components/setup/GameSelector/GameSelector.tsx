import React from "react";
import styles from "./GameSelector.module.scss";
import { Trophy, Hash, Target } from "lucide-react";
import { Game } from "@domain/models";

interface Props {
  games: Game[];
  onSelect: (game: Game) => void;
}

export const GameSelector: React.FC<Props> = ({ games, onSelect }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "points_limit":
        return <Target size={20} />;
      case "rounds_limit":
        return <Hash size={20} />;
      default:
        return <Trophy size={20} />;
    }
  };

  return (
    <div className={styles.grid}>
      {games.map((game) => (
        <button
          key={game.id}
          className={styles.card}
          onClick={() => onSelect(game)}
        >
          <div className={styles.iconWrapper}>
            {getIcon(game.rules.scoringType)}
          </div>
          <div className={styles.info}>
            <h3>{game.name}</h3>
            <span>
              {game.rules.scoringType.replace("_", " ")}
              {game.rules.limit ? `: ${game.rules.limit}` : ""}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
};
