import { popSlash, prependSlash } from "./string";

export type Href = {
  type: "internal" | "external" | "octo" | "unknown";
  url: string;
};

// computes href given to, current pathname, and optional basename
export function getHref(
  to: string,
  pathname: string,
  normalizedBasename: string
): Href {
  // external
  if (isExternal(to)) return { type: "external", url: to };

  // hash only
  if (to.startsWith("#")) return { type: "octo", url: to };

  const type = "internal";

  // absolute
  if (to.startsWith("/")) {
    return { type, url: normalizedBasename + to };
  }

  // relative
  pathname = stripBasename(prependSlash(pathname), normalizedBasename);
  if (!to || to.startsWith("#"))
    return { type, url: normalizedBasename + pathname + to };

  return {
    type,
    url: normalizedBasename + popSlash(pathname) + prependSlash(to),
  };
}

// formats with a starting slash and removes trailing slash
export function normalizeBasename(basename: string): string {
  if (!basename || basename === "/") return "";

  return prependSlash(popSlash(basename));
}

// simple heuristic check
export function isExternal(to: string) {
  return /^(https?:\/\/|mailto:|tel:)/i.test(to);
}

export function stripBasename(pathname: string, basename: string) {
  if (!basename) return pathname;

  if (pathname === basename) return "/";

  if (pathname.startsWith(basename + "/")) {
    return pathname.slice(basename.length);
  }

  return pathname;
}
