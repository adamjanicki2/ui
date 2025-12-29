export type Href = {
  type: "internal" | "external" | "unknown";
  url: string;
};

// computes href given to, current pathname, and optional basename
export function getHref(to: string, pathname: string, basename: string): Href {
  // external
  if (isExternal(to)) return { type: "external", url: to };

  basename = normalizeBasename(basename);
  const type = "internal";

  // absolute
  if (to.startsWith("/")) {
    return { type, url: basename + to };
  }

  // relative
  pathname = stripBasename(prependSlash(pathname), basename);
  if (!to) return { type, url: basename + pathname };

  return { type, url: basename + popSlash(pathname) + prependSlash(to) };
}

// formats with a starting slash and removes trailing slash
function normalizeBasename(basename: string): string {
  if (!basename || basename === "/") return "";

  return prependSlash(popSlash(basename));
}

// simple heuristic check
export function isExternal(to: string) {
  return /^(https?:\/\/|mailto:|tel:)/i.test(to);
}

function prependSlash(str: string) {
  return str.startsWith("/") ? str : `/${str}`;
}

function popSlash(str: string) {
  return str.replace(/\/$/, "");
}

function stripBasename(pathname: string, basename: string) {
  if (!basename) return pathname;

  if (pathname === basename) return "/";

  if (pathname.startsWith(basename + "/")) {
    return pathname.slice(basename.length);
  }

  return pathname;
}
