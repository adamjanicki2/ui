import type { PathParams } from "../types/navigation";
import { normalizeSlashes } from "./slash";

export function matchPath(
  pattern: string,
  pathname: string
): PathParams | false {
  pattern = normalizeSlashes(pattern);
  pathname = normalizeSlashes(pathname);

  if (!pattern.includes(":")) return pattern === pathname ? {} : false;

  const patternSegments = pattern.split("/").filter(Boolean);
  const pathSegments = pathname.split("/").filter(Boolean);

  if (patternSegments.length !== pathSegments.length) return false;

  const params: PathParams = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const pathSegment = pathSegments[i];

    // dynamic
    if (patternSegment.startsWith(":")) {
      const paramName = patternSegment.slice(1).trim();
      if (!paramName) return false;

      params[paramName] = pathSegment;
    }
    // static
    else if (patternSegment !== pathSegment) return false;
  }

  return params;
}
