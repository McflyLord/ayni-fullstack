import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Registra la caché offline en localhost y en producción (HTTPS).
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.warn("No se pudo activar la caché offline de AYNI.", error);
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
