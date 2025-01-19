import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppDataProvider } from "./Context/AppDataContext.tsx";
import { UserProvider } from "./Context/UserContext.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <AppDataProvider>
            <App />
          </AppDataProvider>
        </QueryClientProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
