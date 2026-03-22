import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { store } from "./store.ts";
import AuthProvider from "./providers/AuthProvider.tsx";
import { ThemeProvider } from "./components/shared/ThemeContext.tsx";
import { Toaster } from "./components/shared/Toaster.tsx";
import { Analytics } from "@vercel/analytics/react";

import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <Router>
          <Toaster />
          <AuthProvider>
            <App />
            <Analytics />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </Provider>
  </StrictMode>,
);
