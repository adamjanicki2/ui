import React from "react";
import type { PathParams } from "./types";

const PathParamsContext = React.createContext<PathParams | null>(null);
export default PathParamsContext;
