import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { useSessionStore } from "./store/sessionStore";
import { BoardGameProvider } from "./context/BoardGameProvider";

// Recuperar dados do IndexedDB antes do render inicial
useSessionStore
  .getState()
  .hydrate()
  .then(() => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
      <React.StrictMode>
        <BoardGameProvider>
          <App />
        </BoardGameProvider>
      </React.StrictMode>,
    );
  });
