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

export const accordionSnippet = `
<Accordion
  drawers={[
    {
      label: "Success",
      content: (
        <Alert type="success">We live in a Twilight World.</Alert>
      ),
    },
    {
      label: "Info",
      content: (
        <Alert type="info">We live in a Twilight World.</Alert>
      ),
    },
    {
      label: "Error",
      content: (
        <Alert type="error">We live in a Twilight World.</Alert>
      ),
    },
  ]}
/>
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
  keepMounted
  duration={0.8}
  visible={animatedOpen}
  animateTo={{
    style: { opacity: 1, transform: "rotate(0)" },
  }}
  animateFrom={{
    style: { opacity: 0, transform: "rotate(0.5turn)" },
  }}
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

export const boxSnippet = `
<Box vfx={{ axis: "x", align: "end", justify: "center", padding: "xs", gap: "xs" }}>
  <Box vfx={{ axis: "y", align: "center", justify: "center", padding: "m" }}>
    L
  </Box>
  <Box vfx={{ axis: "y", align: "center", justify: "center", padding: "l" }}>
    XL
  </Box>
  <Box vfx={{ axis: "y", align: "center", justify: "center", padding: "xxl" }}>
    XXL
  </Box>
</Box>
`;

export const buttonSnippet = `
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<UnstyledButton>Unstyled</UnstyledButton>
<IconButton icon={download} />
`;

export const carouselSnippet = `
<Carousel autoplayInterval={5}>
  <Box>"We live in a twilight world"</Box>
  <Box>"We live in a twilight world"</Box>
  <Box>"We live in a twilight world"</Box>
</Carousel>
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
  value={inputValue}
  onChange={(e) => setInputValue(e.target.value)}
/>
<IconInput startIcon={<span>🔎</span>} inputProps={{placeholder: "Search..."}} />
<TextArea placeholder="Type something..." />
`;

export const burgerSnippet = `
<DoubleSpin open={burgerOpen} onClick={toggleBurger} className="red" />
<DoubleFlip open={burgerOpen} onClick={toggleBurger} className="orange" />
<DoubleCross open={burgerOpen} onClick={toggleBurger} className="yellow" />
<TripleSpin open={burgerOpen} onClick={toggleBurger} className="green" />
<TripleFlip open={burgerOpen} onClick={toggleBurger} className="blue" />
<TripleFade open={burgerOpen} onClick={toggleBurger} className="indigo" />
<TriplePrestige open={burgerOpen} onClick={toggleBurger} className="violet" />
`;

export const layerSnippet = `
<Layer onClose={() => setLayerOpen(false)}>
  <Box>
    <h1>Hello!</h1>
  </Box>
</Layer>
`;

export const modalSnippet = `
<Modal
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  onConfirm={() => {}}
>
  <Box>
    Welcome to my modal. You can put all sorts of stuff in here if
    you'd like.
  </Box>
</Modal>
`;

export const linkSnippet = `
<Link to="#link">Internal link</Link>
<Link to="https://adamovies.com" newTab>External link</Link>
<UnstyledLink to="#link">Unstyled link</UnstyledLink>
<ButtonLink to="#link">Button link</ButtonLink>
`;

export const selectSnippet = `
const fruits = ["apple", "orange", "banana", "kiwi"];
<Select options={fruits} />
<Select 
  options={fruits} 
  value={selectedFruit}
  onChange={(e) => setSelectedFruit(e.target.value)}
/>
`;

export const spinnerSnippet = `
<Spinner />
<Spinner style={{ height: 36, color: "red" }} />
<Spinner style={{ height: 48, color: "blue" }} />
`;

export const avatarSnippet = `
<Avatar username="A" size="m" />
<Avatar username="B" size="m" />
<Avatar username="C" size="m" />
<Avatar username="D" size="m" />
<Avatar username="E" size="m" />
<Avatar
  backgroundImage="https://adamjanicki.xyz/images/logo512.png"
  username="A"
  size="m"
/>`;
