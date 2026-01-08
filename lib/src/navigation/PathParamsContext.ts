import React from "react";

import type { PathParams } from "../types/navigation";

const PathParamsContext = React.createContext<PathParams | null>(null);
export default PathParamsContext;
