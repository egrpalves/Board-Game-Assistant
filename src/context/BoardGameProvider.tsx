import { Game } from "@domain/models";
import { createContext, Dispatch, useState } from "react";

export type BoardGameContextType = {
  selectedGame: Game | null;
  setSelectedGame: Dispatch<React.SetStateAction<Game | null>>;
};

export const BoardGameContext = createContext<BoardGameContextType | undefined>(
  undefined,
);

export function BoardGameProvider({ children }: { children: React.ReactNode }) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  return (
    <BoardGameContext.Provider value={{ selectedGame, setSelectedGame }}>
      {children}
    </BoardGameContext.Provider>
  );
}
