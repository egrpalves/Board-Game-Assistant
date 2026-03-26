import React from "react";
import { useSessionStore } from "./store/sessionStore";
import { GameTable } from "./components/session/GameTable/GameTable";
import { GameSelector } from "./components/setup/GameSelector/GameSelector";
import { PlayerSetup } from "./components/setup/PlayerSetup/PlayerSetup";
import UpdatePrompt from "./components/UpdatePrompt/UpdatePrompt";
import gamesData from "./data/games.json";
import { Game } from "./domain/models";
import styles from "./App.module.scss";
import { useBoardGame } from "./hooks/useBoardGame";

const App: React.FC = () => {
  const { session } = useSessionStore();
  const { selectedGame, setSelectedGame } = useBoardGame();

  // 1. Se o jogo terminou ou não começou, e não selecionámos nada: Mostrar Catálogo
  if (!session && !selectedGame) {
    return (
      <main className={styles.container}>
        <UpdatePrompt />
        <header className={styles.header}>
          <h1>Board Game Assistant</h1>
          <p>Escolhe um jogo para começar</p>
        </header>
        <GameSelector
          games={gamesData as Game[]}
          onSelect={(game) => setSelectedGame(game)}
        />
      </main>
    );
  }

  // 2. Jogo selecionado mas sessão ainda não criada: Configurar Jogadores
  if (!session && selectedGame) {
    return (
      <main className={styles.container}>
        <UpdatePrompt />
        <button
          className={styles.backBtn}
          onClick={() => setSelectedGame(null)}
        >
          ← Voltar ao Catálogo
        </button>
        <PlayerSetup
          game={selectedGame}
          onCancel={() => setSelectedGame(null)}
        />
      </main>
    );
  }

  // 3. Sessão Ativa: Tabuleiro de Jogo
  const activeGame = (gamesData as Game[]).find(
    (g) => g.id === session?.gameId,
  );

  return (
    <main className={styles.container}>
      <UpdatePrompt />
      {activeGame ? (
        <GameTable game={activeGame} />
      ) : (
        <div className={styles.error}>
          Jogo não encontrado no catálogo local.
        </div>
      )}
    </main>
  );
};

export default App;
