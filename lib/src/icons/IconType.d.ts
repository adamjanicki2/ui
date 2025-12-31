// hacky type to loosely enforce icon paths are imported from icons/
declare const brand: unique symbol;
export type IconType = string & { readonly [brand]: true };
