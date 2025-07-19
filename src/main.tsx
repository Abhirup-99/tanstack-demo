import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import VirtualizedTable from "./VirtualizedTable.tsx";
import "./App.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VirtualizedTable />
  </StrictMode>
);
