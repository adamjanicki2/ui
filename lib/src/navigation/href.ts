import { normalizeSlashes, popSlash, prependSlash } from "./slash";

export type Href = {
  type: "external" | "internal" | "octo" | "unknown";
  url: string;
};

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
  if (to.startsWith("/")) return { type, url: normalizedBasename + to };

  // relative
  pathname = stripBasename(prependSlash(pathname), normalizedBasename);
  if (!to || to.startsWith("#"))
    return { type, url: normalizedBasename + pathname + to };

  return {
    type,
    url: normalizedBasename + popSlash(pathname) + prependSlash(to),
  };
}

export function normalizeBasename(basename: string): string {
  return !basename || basename === "/" ? "" : normalizeSlashes(basename);
}

export function isExternal(to: string) {
  return /^(https?:\/\/|mailto:|tel:)/i.test(to);
}

export function stripBasename(pathname: string, basename?: string) {
  if (!basename) return pathname;

  if (pathname === basename) return "/";

  if (pathname.startsWith(basename + "/"))
    return pathname.slice(basename.length);

  return pathname;
}
