import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.tsx";
import "./index.css";
import { store, persistor } from "./store.ts";
import { PersistGate } from "redux-persist/integration/react";
import AuthProvider from "./providers/AuthProvider.tsx";
import { ThemeProvider } from "./components/shared/ThemeContext.tsx";
import { Toaster } from "./components/shared/Toaster.tsx";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { TooltipProvider } from "@/components/ui/tooltip";

import { BrowserRouter as Router } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <Router>
            <Toaster />
            <TooltipProvider delayDuration={150}>
              <AuthProvider>
                <App />
                <Analytics />
                <SpeedInsights />
              </AuthProvider>
            </TooltipProvider>
          </Router>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
);
