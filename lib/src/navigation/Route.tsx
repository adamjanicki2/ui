import type * as React from "react";

export type Props = {
  /** Element to render when the path matches */
  element: React.ReactElement;
  /**
   * Path pattern to match against window.location.pathname.
   * Currently, only 2 types are supported.
   * 1. Static: `/reviews/movies`.
   * 2. Dynamic (params): `/reviews/:media/:title/view`.
   * In the future, I might extend use to include wildcard matching if I need it.
   * @example "/movie/:id"
   */
  path: string;
};

/** A simple wrapper to be used by <Routes> */
export default function Route({}: Props) {
  return null;
}
