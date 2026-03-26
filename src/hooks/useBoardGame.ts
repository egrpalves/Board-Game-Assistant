import { useContext } from "react";
import {
  BoardGameContext,
  BoardGameContextType,
} from "../context/BoardGameProvider";

export function useBoardGame(): BoardGameContextType {
  const context = useContext(BoardGameContext);
  if (!context) {
    throw new Error("useBoardGame must be used within BoardGameProvider");
  }
  return context;
}
