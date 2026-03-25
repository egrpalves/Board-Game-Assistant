import { create } from 'zustand';
import { Session, Game, Player, ScoreEntry } from '../domain/models';
import { GameEngine } from '../app/engine';
import { storage } from '../infrastructure/storage';

interface SessionState {
  session: Session | null;
  // Ações
  hydrate: () => Promise<void>;
  createSession: (game: Game, playerNames: string[]) => void;
  submitRound: (roundScores: Record<string, number>, game: Game) => void;
  updateRoundScore: (playerId: string, round: number, newValue: number) => void;
  forceEndGame: (game: Game) => void;
  resetSession: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  session: null,

  /**
   * Recupera a sessão do IndexedDB ao iniciar a App
   */
  hydrate: async () => {
    const saved = await storage.loadSession();
    if (saved) set({ session: saved });
  },

  /**
   * Inicializa uma nova sessão de jogo
   */
  createSession: (game, playerNames) => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      gameId: game.id,
      players: playerNames.map((name) => ({
        id: crypto.randomUUID(),
        name: name.trim(),
      })),
      scores: [],
      currentRound: 1,
      status: 'active',
    };

    set({ session: newSession });
    storage.saveSession(newSession); // Persiste no IndexedDB
  },

  /**
   * Regista as pontuações de uma ronda e verifica fim de jogo
   */
  submitRound: (roundScores, game) => {
    const { session } = get();
    if (!session) return;

    const newEntries: ScoreEntry[] = Object.entries(roundScores).map(
      ([playerId, value]) => ({
        playerId,
        value,
        round: session.currentRound,
      })
    );

    const updatedSession: Session = {
      ...session,
      scores: [...session.scores, ...newEntries],
      currentRound: session.currentRound + 1,
    };

    // O Rule Engine decide se o jogo acaba aqui
    const { isFinished, winners } = GameEngine.checkGameEnd(
      updatedSession,
      game
    );

    if (isFinished) {
      updatedSession.status = 'finished';
      updatedSession.winners = winners;
    }

    set({ session: updatedSession });
    storage.saveSession(updatedSession);
  },

  /**
   * Atualiza o valor de pontos de um jogador numa ronda específica
   */
  updateRoundScore: (playerId, round, newValue) => {
    const { session } = get();
    if (!session) return;

    const updatedScores = session.scores.map((entry) => {
      if (entry.playerId === playerId && entry.round === round) {
        return { ...entry, value: newValue };
      }
      return entry;
    });

    const updated: Session = {
      ...session,
      scores: updatedScores,
    };

    set({ session: updated });
    storage.saveSession(updated);
  },

  /**
   * Termina o jogo manualmente antes de atingir as condições
   */
  forceEndGame: (game) => {
    const { session } = get();
    if (!session) return;

    const { winners } = GameEngine.checkGameEnd(session, game);
    const updated: Session = {
      ...session,
      status: 'finished',
      winners,
    };

    set({ session: updated });
    storage.saveSession(updated);
  },

  /**
   * Limpa a sessão atual e o storage (Reset total)
   */
  resetSession: () => {
    set({ session: null });
    storage.clearSession();
  },
}));
