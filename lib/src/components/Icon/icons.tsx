import React from "react";

type IconDefinition = {
  readonly contents: React.JSX.Element[];
  readonly viewBox?: string;
};

export type IconType = "up" | "down" | "left" | "right";
const arrowPath =
  "M94.0908,296.3057c-29.82338,0-54-24.17662-54-54s24.17662-54,54-54c.00237,0,.00475,0,.00712,0c.0017,0,141.65138,0,221.99288,0v-222c0-29.82338,24.17662-54,54-54s54,24.17662,54,54c0,.00237,0,.00475,0,.00712s0,273.40726,0,275.97468c0,.00607,0,.01213,0,.0182c0,29.82338-24.17662,54-54,54h-276Z";

const icons: Record<IconType, IconDefinition> = {
  down: {
    contents: [
      <path
        d={arrowPath}
        transform="matrix(.707107 0.707107-.707107 0.707107 165.642289-79.868246)"
      />,
    ],
  },
  up: {
    contents: [
      <path
        d={arrowPath}
        transform="matrix(-.707107-.707107 0.707107-.707107 346.357711 591.868246)"
      />,
    ],
  },
  left: {
    contents: [
      <path
        d={arrowPath}
        transform="matrix(-.707107 0.707107-.707107-.707107 591.868246 165.642289)"
      />,
    ],
  },
  right: {
    contents: [
      <path
        d={arrowPath}
        transform="matrix(.707107-.707107 0.707107 0.707107-79.868246 346.357711)"
      />,
    ],
  },
};

export default icons;
