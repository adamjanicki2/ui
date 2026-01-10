import React from "react";

import type { Location, Navigate } from "../types/navigation";

type RouterContextValue = {
  /** Optional basename prefix for all internal navigation */
  basename: string;
  /** Current location */
  location: Location;
  /** Push-style navigation */
  navigate: Navigate;
};

const RouterContext = React.createContext<RouterContextValue | null>(null);

export default RouterContext;
