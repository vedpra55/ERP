import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthContextProvider } from "./context/AuthContext.tsx";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <AuthContextProvider>
        <BrowserRouter>
          <Toaster />
          <App />
        </BrowserRouter>
      </AuthContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
