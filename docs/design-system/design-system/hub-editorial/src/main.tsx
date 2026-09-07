import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "../tokens.css";
import "../components.css";
import "./studio.css";

const root = document.getElementById("root");
if (!root) throw new Error("O elemento raiz do showcase não foi encontrado.");
createRoot(root).render(<StrictMode><App /></StrictMode>);
