import React from "react";
import type { Location, Navigate } from "./types";

type RouterContextValue = {
  /** Current location */
  location: Location;
  /** Push-style navigation */
  navigate: Navigate;
  /** Optional basename prefix for all internal navigation */
  basename: string;
};

export const RouterContext = React.createContext<RouterContextValue | null>(
  null
);
