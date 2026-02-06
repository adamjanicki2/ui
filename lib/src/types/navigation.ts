/** Location object of the current URL */
export type Location = {
  /** URL hash */
  hash: string;
  /** URL pathname */
  pathname: string;
  /** URL search */
  search: string;
};

export type HistoryMode = "push" | "replace";

/** Additional params to feed the navigate() function */
export type NavigateOptions = {
  /** Whether to append a new entry or overwrite the current browser URL in history */
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
   * @example navigate(-1)
   */
  (historyOffset: number): void;
};

/** Params from the pathname */
export type PathParams = {
  [key: string]: string | undefined;
};

/** Params from the search string */
export type SearchParams = {
  [key: string]: string | string[] | undefined;
};

/** Callback or object to update search params */
export type SetSearchParamsArg =
  | SearchParams
  | ((prev: SearchParams) => SearchParams);

/** Callback to update search params and reload relevant hooks */
export type SetSearchParams = (next: SetSearchParamsArg) => void;
