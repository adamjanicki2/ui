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

export const clickOutsideSnippet = `
<ClickOutside onClickOutside={() => console.log("You did it!")}>
  <Alert type="info">Click outside me!</Alert>
</ClickOutside>
`;

export const inputSnippet = `
<Input placeholder="Type something..." />
<Input
  placeholder="Type something..."
  className="ma1 bg-white"
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
/>
<IconInput startIcon={<span>🔎</span>} inputProps={{placeholder: "Search..."}} />
<TextArea placeholder="Type something..." />
`;

export const layerSnippet = `
<Layer onClose={() => setLayerOpen(false)}>
  <div className="bg-white">
    <h1>Hello!</h1>
  </div>
</Layer>
`;

export const linkSnippet = `
<Link to="#link">Internal link</Link>
<Link to="https://adamovies.com" target="_blank" rel="noreferrer">External link →</Link>
<UnstyledLink to="#link">Unstyled link</UnstyledLink>
`;

export const selectSnippet = `
const fruits = ["apple", "orange", "banana", "kiwi"];
<Select options={fruits} aria-label="select fruit" />
<Select 
  options={fruits} 
  aria-label="select fruit" 
  value={selectedFruit}
  onChange={(e) => setSelectedFruit(e.target.value)}
/>
`;

export const spinnerSnippet = `
<Spinner className="ma1" />
<Spinner style={{ height: 36, color: "red" }} />
<Spinner style={{ height: 48, color: "blue" }} />
`;

export const focusTrapSnippet = `
// in your modal component ...
// accepts a parameter for whether or not to trap focus
const trapRef = useFocusTrap<HTMLDivElement>(true);
return (
  // disables focus outside of this div
  <div ref={trapRef}>
    <h1>Modal</h1>
    <p>Some content...</p>
    <button>Close</button>
  </div>
);
`;

export const mediaQuerySnippet = `
// in your nav component ...
const isMobile = useMediaQuery({query: "(max-width: 768px)"});
return isMobile ? <MobileNav /> : <DesktopNav />;
`;

export const scrollLockSnippet = `
// in your modal component ...
// locks scrolling when modal is open
useScrollLock(modalOpen);
return (
  <div>
    <h1>Modal</h1>
    <p>Some content...</p>
    <button>Close</button>
  </div>
);
`;

export const scrollToHashSnippet = `
// in your docs page with headings ...
// scrolls to the hash in the URL on load
useScrollToHash({active: true});
return (
  <section>
    <h1 id="heading-1">Heading 1</h1>
    <p>Some content...</p>
    <h2 id="heading-2">Heading 2</h2>
    <p>Some content...</p>
  </section>
);
`;

export const watchScrollSnippet = `
// in your nav component ...
// watches for scroll events and updates state
useWatchScroll(() => {
  setScrolled(window.scrollY > 0);
});
`;

export const windowResizeSnippet = `
// in your component that needs to know the window size ...
// updates state when the window is resized
useWindowResize(() => {
  setWindowSize(window.innerWidth);
});
`;

export const classNamesSnippet = `
// in any component ...
// conditionally apply classes
<div className={classNames("container", isWhite ? "white" : null)}>
  Some content...
</div>
`;

export const scrollToIdSnippet = `
// in some function or component ...
// scrolls to an element with a specific ID
scrollToId("some-id");
`;
