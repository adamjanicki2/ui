import React from "react";
import type { PathParams } from "../types";
import PathParamsContext from "../PathParamsContext";

/**
 * Get the params from the current pathname
 *
 * @returns the params from the current path
 * e.g. `{id: "1"}` for `/movie/:id <=> /movie/1`
 */
export default function usePathParams(): PathParams {
  const params = React.useContext(PathParamsContext);
  if (!params) {
    throw new Error(
      "usePathParams() must be used inside of a <Router> component"
    );
  }

  return params;
}
