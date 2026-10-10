import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { EnhancedAuthProvider } from "./contexts/EnhancedAuthContext";
import "./index.css";
import App from "./App.tsx";

// Apply saved theme before React renders (prevents flash)
const stored = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (stored === "dark" || (!stored && prefersDark)) {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <EnhancedAuthProvider>
        <App />
      </EnhancedAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
