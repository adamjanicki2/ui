declare const auiIcon: unique symbol;
export type IconType = string & { readonly [auiIcon]: "auiIcon" };
