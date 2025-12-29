import React, { useCallback } from "react";
import type { ReadonlyableArray } from "../utils/types";

/**
 * Simple hook that merges N refs into one callback
 *
 * @param refs all the refs you want to merge
 * @returns one combined ref
 */
const useMergeRefs = <T>(
  ...refs: ReadonlyableArray<React.Ref<T> | null | undefined>
): React.Ref<T> => {
  return useCallback(
    (node: T) => {
      refs.forEach((ref) => {
        if (typeof ref === "function") {
          ref(node);
        } else if (ref && typeof ref === "object") {
          ref.current = node;
        }
      });
    },
    [refs]
  );
};

export default useMergeRefs;
