import React from "react";

import type {
  SearchParams,
  SetSearchParams,
  SetSearchParamsArg,
} from "../types/navigation";
import useRouterContext from "./useRouterContext";

function deserialize(search: string): SearchParams {
  const urlSearchParams = new URLSearchParams(search);
  const params: SearchParams = {};

  urlSearchParams.forEach((value, key) => {
    const existing = params[key];
    if (existing === undefined) params[key] = value;
    else if (Array.isArray(existing)) existing.push(value);
    else params[key] = [existing, value];
  });

  return params;
}

function serialize(params: SearchParams): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value))
        value.forEach((subvalue) => searchParams.append(key, subvalue));
      else searchParams.set(key, value);
    }
  });

  const stringified = searchParams.toString();
  return stringified ? `?${stringified}` : "";
}

/**
 * Get and update URL search params.
 *
 * @returns Tuple of params and a setter.
 */
export default function useSearchParams(): [SearchParams, SetSearchParams] {
  const router = useRouterContext("useSearchParams()");
  const { location, navigate } = router;
  const { pathname, hash, search } = location;

  const params = React.useMemo(() => deserialize(search), [search]);

  const setSearchParams = React.useCallback(
    (next: SetSearchParamsArg) => {
      const nextParams = typeof next === "function" ? next(params) : next;

      const url = pathname + serialize(nextParams) + hash;

      navigate(url);
    },
    [navigate, pathname, hash, params]
  );

  return [params, setSearchParams];
}
