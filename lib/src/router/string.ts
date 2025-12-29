export function prependSlash(str: string) {
  return str.startsWith("/") ? str : `/${str}`;
}

export function popSlash(str: string) {
  return str.replace(/\/$/, "");
}
