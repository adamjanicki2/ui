import type { Children } from "src/types";
import Box, { type BoxProps } from "@adamjanicki/ui/components/Box/Box";
import { ui, useScrollToHash } from "@adamjanicki/ui";
import { useDocumentTitle } from "src/hooks";

type Props = Omit<BoxProps, "children" | "title"> & {
  children: Children;
  title: string;
};

export default function Page({ children, title, vfx, ...rest }: Props) {
  useDocumentTitle(title);
  useScrollToHash();

  return (
    <Box
      {...rest}
      vfx={{
        width: "full",
        paddingBottom: "xl",
        marginX: "auto",
        paddingX: "m",
        ...vfx,
      }}
    >
      {title && <ui.h1 vfx={{ width: "full" }}>{title}</ui.h1>}
      {children}
    </Box>
  );
}
