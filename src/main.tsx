import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { EnhancedAuthProvider } from "./contexts/EnhancedAuthContext";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <EnhancedAuthProvider>
        <App />
      </EnhancedAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
