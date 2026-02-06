import type * as React from "react";

export type Props = {
  /** Element to render when the path matches */
  element: React.ReactElement;
  /**
   * Path pattern to match against the pathname.
   * @example "/movie/:id"
   */
  path: string;
};

/** Wrapper used by <Routes> */
export default function Route({}: Props) {
  return null;
}
