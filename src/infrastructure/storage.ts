import { openDB, IDBPDatabase } from "idb";
import { Session } from "../domain/models";

const DB_NAME = "game_board_db";
const STORE_NAME = "active_session";

export const storage = {
  async getDb(): Promise<IDBPDatabase> {
    return openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME);
      },
    });
  },

  async saveSession(session: Session): Promise<void> {
    const db = await this.getDb();
    await db.put(STORE_NAME, session, "current");
  },

  async loadSession(): Promise<Session | null> {
    const db = await this.getDb();
    return db.get(STORE_NAME, "current");
  },

  async clearSession(): Promise<void> {
    const db = await this.getDb();
    await db.delete(STORE_NAME, "current");
  },
};
