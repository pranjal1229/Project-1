import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";   // ✅ THIS MUST EXIST
import "./App.css";     // ✅ YOUR ATM STYLES

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
