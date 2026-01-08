import "@adamjanicki/ui/style.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "src/App";
import "src/css/media.css";
import "src/css/style.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
