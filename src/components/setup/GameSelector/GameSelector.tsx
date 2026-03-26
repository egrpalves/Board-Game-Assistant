import React from "react";
import styles from "./GameSelector.module.scss";
import { Hash, Target } from "lucide-react";
import { Game } from "@domain/models";

interface Props {
  games: Game[];
  onSelect: (game: Game) => void;
}

export const GameSelector: React.FC<Props> = ({ games, onSelect }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "points_limit":
        return <Target size={30} />;
      case "rounds_limit":
        return <Hash size={30} />;
      default:
        return <img src={`src/assets/${type}`} style={{ width: "30px" }} />;
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
            {getIcon(game.icon ?? game.rules.scoringType)}
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
