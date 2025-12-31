// hacky type to loosely enforce icon paths are imported from icons/
// technically it would work with any path string using `as IconType`
declare const brand: unique symbol;
export type IconType = string & { readonly [brand]: "IconType" };
