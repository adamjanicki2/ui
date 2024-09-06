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

export const animatedSnippet = `
<Animated
  visible={animatedOpen}
  enter={{ style: { opacity: 1 } }}
  exit={{ style: { opacity: 0 } }}
>
  <Alert type="info">This is an animated alert!</Alert>
</Animated>
`;

export const badgeSnippet = `
<Badge type="static">Static</Badge>
<Badge type="info">Info</Badge>
<Badge type="success">Success</Badge>
<Badge type="warning">Warning</Badge>
<Badge type="error">Error</Badge>
`;

export const bannerSnippet = `
<Banner type="static">This is a static banner</Banner>
<Banner type="info">This is an info banner</Banner>
<Banner type="success">This is a success banner</Banner>
<Banner type="warning">This is a warning banner</Banner>
<Banner type="error">This is an error banner</Banner>
`;

export const buttonSnippet = `
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="transparent">Transparent</Button>
<UnstyledButton>Unstyled</UnstyledButton>
`;
