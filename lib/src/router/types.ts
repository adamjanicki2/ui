/**
 * Location object of the current URL.
 */
export type Location = {
  /** URL pathname (e.g. "/movies/123") */
  pathname: string;
  /** URL search (e.g. "?q=inception") */
  search: string;
  /** URL hash (e.g. "#home") */
  hash: string;
};

/**
 * A function to handle page navigation
 */
export type Navigate = (to: string) => void;
