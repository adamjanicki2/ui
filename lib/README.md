# @adamjanicki/ui

_Warning: use at own risk! This library is primarily designed for usage by me across my other projects, so while I try to write good code, there will be some bugs, and more importantly, I make breaking changes often!_

## Installation

```bash
npm install @adamjanicki/ui
```

## Usage

```tsx
import { Button } from "@adamjanicki/ui";

const App = () => {
  return (
    <Button onClick={() => console.log("Button clicked")}>Click me</Button>
  );
};
```

## Importing CSS

Unfortunately, there was no great way to handle CSS. I hate how large libraries make it extremely difficult to override CSS without using `!important`, or using inline styles. So, I've decided to require importing the CSS directly into your project. Here's an example of how to do it:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
// Make sure to import this first so your styles take priority!
import "@adamjanicki/ui/style.css";
// All your other style imports can go below here!
import "src/css/style.css";
import App from "src/App";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## Components

I'm not going to rewrite all the stuff I already wrote on my [demo site](https://adamjanicki.xyz/ui/), so go explore the component there if you'd like.
