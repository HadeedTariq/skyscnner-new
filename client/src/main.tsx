import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./i18n.ts";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          richColors
          toastOptions={{
            className:
              "bg-white text-gray-800 border border-gray-200 shadow-lg",
            duration: 4000,
            descriptionClassName: "text-black text-sm font-medium",
          }}
        />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
