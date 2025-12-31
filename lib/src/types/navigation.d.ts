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
 * Additional params to feed the navigate() function
 */
type NavigateOptions = {
  /**
   * Whether to overwrite the current browser url in history
   * @default false
   */
  replace?: boolean;
};

/**
 * A function to handle page navigation
 */
export type Navigate = (to: string, options?: NavigateOptions) => void;

/**
 * Object containing params from the pathname
 * e.g. `{id: "1"}` for `/movie/:id <=> /movie/1`
 */
export type PathParams = {
  [key: string]: string | undefined;
};

/**
 * Object containing params from the search string
 * e.g. `{id: "1", movies: ["inception", "alien"]}` for `"?id=1&movies=inception&movies=alien"`
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
