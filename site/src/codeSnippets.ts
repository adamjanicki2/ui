export const importCss = `
// in your root file, like index.tsx:
import React from "react";
import ReactDOM from "react-dom/client";
// import mine first
import "@adamjanicki/ui/style.css";
// then yours below!
import "src/css/style.css";
import App from "src/App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

export const alertSnippet = `
<Alert type="static">This is a static alert</Alert>
<Alert type="info">This is an info alert</Alert>
<Alert type="success">This is a success alert</Alert>
<Alert type="warning">This is a warning alert</Alert>
<Alert type="error">This is an error alert</Alert>
`;
