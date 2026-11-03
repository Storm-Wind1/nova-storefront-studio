import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

const element = document.getElementById("root");
if (!element) throw new Error("NOVA's root element is missing");
document.querySelectorAll("[data-pages-fallback]").forEach((tag) => tag.remove());
createRoot(element).render(<RouterProvider router={getRouter()} />);
