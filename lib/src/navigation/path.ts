import { popSlash, prependSlash } from "./slash";
import type { PathParams } from "../types/navigation";

function normalizePath(path: string) {
  path = prependSlash(path);
  if (path.length > 1) {
    path = popSlash(path);
  }

  return path;
}

export function matchPath(
  pattern: string,
  pathname: string
): PathParams | false {
  const normalizedPattern = normalizePath(pattern);
  const normalizedPathname = normalizePath(pathname);

  if (!normalizedPattern.includes(":")) {
    return normalizedPattern === normalizedPathname ? {} : false;
  }

  const patternSegments = normalizedPattern.split("/").filter(Boolean);
  const pathSegments = normalizedPathname.split("/").filter(Boolean);

  if (patternSegments.length !== pathSegments.length) {
    return false;
  }

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
    else if (patternSegment !== pathSegment) {
      return false;
    }
  }

  return params;
}
