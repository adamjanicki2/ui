export function prependSlash(str: string) {
  return str.startsWith("/") ? str : `/${str}`;
}

export function popSlash(str: string) {
  return str.replace(/\/$/, "");
}

export function normalizeSlashes(path: string): string {
  if (!path) return "/";
  path = prependSlash(path);
  if (path.length > 1) {
    path = popSlash(path);
  }
  return path;
}
