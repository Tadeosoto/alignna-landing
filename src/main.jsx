import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

function showBootError(err) {
  const message = err?.stack || err?.message || String(err);
  console.error("[boot]", err);
  const root = document.getElementById("root");
  if (!root) return;
  root.innerHTML = `<pre style="white-space:pre-wrap;padding:1.5rem;margin:0;font:13px/1.45 ui-monospace,monospace;color:#7f1d1d;background:#fef2f2;min-height:100vh">${message
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")}</pre>`;
}

window.addEventListener("error", (event) => {
  if (event.error) showBootError(event.error);
});
window.addEventListener("unhandledrejection", (event) => {
  showBootError(event.reason);
});

try {
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
} catch (err) {
  showBootError(err);
}
