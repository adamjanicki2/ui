import React from "react";
import useRouterContext from "./useRouterContext";
import type {
  SearchParams,
  SetSearchParams,
  SetSearchParamsArg,
} from "../helpers";

function deserialize(search: string): SearchParams {
  const urlSearchParams = new URLSearchParams(search);
  const searchParams: SearchParams = {};

  urlSearchParams.forEach((value, key) => {
    const existing = searchParams[key];

    if (existing === undefined) {
      searchParams[key] = value;
    } else if (Array.isArray(existing)) {
      existing.push(value);
    } else {
      searchParams[key] = [existing, value];
    }
  });

  return searchParams;
}

function serialize(params: SearchParams): string {
  const urlSearchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((subvalue) => urlSearchParams.append(key, subvalue));
      } else {
        urlSearchParams.set(key, value);
      }
    }
  });

  const stringified = urlSearchParams.toString();
  return stringified ? `?${stringified}` : "";
}

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
