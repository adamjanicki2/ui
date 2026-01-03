declare const brand: unique symbol;
/**
 * Hacky branded-type to loosely enforce icon paths are imported from `icons/`
 * technically it would work with any path string using `as IconType`
 */
export type IconType = string & { readonly [brand]: "IconType" };
