import App from "@/app/App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/app/styles/global.css";
import { SearchProvider } from "@/app/providers/SearchProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SearchProvider>
      <App />
    </SearchProvider>
  </StrictMode>
);
