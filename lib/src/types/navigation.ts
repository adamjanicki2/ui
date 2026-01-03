/** Location object of the current URL */
export type Location = {
  /** URL pathname (eg "/movies/123") */
  pathname: string;
  /** URL search (eg "?q=inception") */
  search: string;
  /** URL hash (eg "#home") */
  hash: string;
};

export type HistoryMode = "push" | "replace";

/** Additional params to feed the navigate() function */
export type NavigateOptions = {
  /**
   * Whether to append a new entry or overwrite the current browser URL in history.
   * @default "push"
   */
  historyMode?: HistoryMode;
};

/** A function to handle page navigation either to a destination URL or relative to browser history */
export type Navigate = {
  /**
   * Navigate to a URL.
   * @example navigate("/settings", { historyMode: "replace" })
   */
  (to: string, options?: NavigateOptions): void;
  /**
   * Navigate relative to the browser history stack.
   * Positive values go forward, negative values go backward.
   * @example navigate(-1)
   */
  (historyOffset: number): void;
};

/**
 * Object containing params from the pathname.
 * Eg `{id: "1"}` for `/movie/:id <=> /movie/1`.
 */
export type PathParams = {
  [key: string]: string | undefined;
};

/**
 * Object containing params from the search string.
 * Eg `{id: "1", movies: ["inception", "alien"]}` for `"?id=1&movies=inception&movies=alien"`.
 */
export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

/** Callback or object to update search params */
export type SetSearchParamsArg =
  | SearchParams
  | ((prev: SearchParams) => SearchParams);

/** Callback to update search params and reload relevant hooks */
export type SetSearchParams = (next: SetSearchParamsArg) => void;
