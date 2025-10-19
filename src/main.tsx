import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Toaster
      position="top-right"
      richColors
      toastOptions={{
        style: {
          borderRadius: "0.5rem",
          fontSize: "0.9rem",
        },
      }}
    />
    <App />
  </StrictMode>
);
