import { ui, useScrollToHash } from "@adamjanicki/ui";
import Box, { BoxProps } from "@adamjanicki/ui/components/Box/Box";
import { useDocumentTitle } from "src/hooks";

type Props = Omit<BoxProps, "children" | "title"> & {
  children: React.ReactNode;
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
      <ui.h1 vfx={{ width: "full" }}>{title}</ui.h1>
      {children}
    </Box>
  );
}
