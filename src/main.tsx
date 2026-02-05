import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { store } from "./store.ts";
import AuthProvider from "./providers/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            borderRadius: "0.5rem",
            fontSize: "0.9rem",
            marginTop: "60px",
          },
        }}
      />
      <AuthProvider>
        <App />
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
