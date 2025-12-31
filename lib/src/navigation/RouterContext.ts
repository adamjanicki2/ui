import React from "react";
import type { Location, Navigate } from "../types/navigation";

type RouterContextValue = {
  /** Current location */
  location: Location;
  /** Push-style navigation */
  navigate: Navigate;
  /** Optional basename prefix for all internal navigation */
  basename: string;
};

const RouterContext = React.createContext<RouterContextValue | null>(null);

export default RouterContext;
