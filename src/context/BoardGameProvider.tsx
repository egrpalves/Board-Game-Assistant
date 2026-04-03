import { Game } from "@domain/models";
import { createContext, Dispatch, useState } from "react";

export type BoardGameContextType = {
  selectedGame: Game | null;
  players: string[];
  setSelectedGame: Dispatch<React.SetStateAction<Game | null>>;
  setPlayers: Dispatch<React.SetStateAction<string[]>>;
};

export const BoardGameContext = createContext<BoardGameContextType | undefined>(
  undefined,
);

export function BoardGameProvider({ children }: { children: React.ReactNode }) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [players, setPlayers] = useState<string[]>(["Jogador 1", "Jogador 2"]);

  return (
    <BoardGameContext.Provider
      value={{ selectedGame, players, setSelectedGame, setPlayers }}
    >
      {children}
    </BoardGameContext.Provider>
  );
}
