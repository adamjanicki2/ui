import React from "react";

export type Props = {
  /** Path pattern to match against window.location.pathname (e.g. `"/movie/:id"`) */
  path: string;
  /** Element to render when the path matches */
  element: React.ReactElement;
};

/**
 * A simple wrapper to be used by <Routes>
 */
export default function Route({}: Props) {
  return null;
}
