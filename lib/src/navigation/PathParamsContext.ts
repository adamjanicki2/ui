import React from "react";
import type { PathParams } from "./helpers";

const PathParamsContext = React.createContext<PathParams | null>(null);
export default PathParamsContext;
