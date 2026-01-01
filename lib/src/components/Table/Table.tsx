import React from "react";
import type { ReadonlyableArray } from "../../types/common";
import type { BoxProps } from "../Box/Box";
import Box from "../Box/Box";
import { UnstyledLink } from "../../navigation/Link";

type LinkProps = React.ComponentProps<typeof UnstyledLink>;

type MinimalItem = {
  id: string;
};

type ContainerProps = Omit<BoxProps, "children">;

type ColumnConfig<
  Item extends MinimalItem,
  Key extends keyof Item = keyof Item
> = {
  key: Key;
  header: React.ReactNode;
  render?: (item: Item) => React.ReactNode;
  cellProps?: ContainerProps;
};

type Props<Item extends MinimalItem> = {
  /** Items to render in the rows of the table */
  items: ReadonlyableArray<Item>;
  /** Columns to render for each data item */
  columns: ReadonlyableArray<ColumnConfig<Item>>;
  /** Compute a URL clicking on this row should navigate to */
  routeTo?: (item: Item) => Pick<LinkProps, "to" | "newTab">;
} & ContainerProps;

const rowContainerVfx = {
  axis: "x",
  gap: "m",
  paddingX: "m",
  paddingY: "s",
  justify: "start",
  align: "center",
} as const;

const Table = <Item extends MinimalItem>({
  items,
  columns,
  routeTo,
  vfx,
  ...boxProps
}: Props<Item>) => (
  // Table container
  <Box
    {...boxProps}
    vfx={{
      axis: "y",
      backgroundColor: "default",
      border: true,
      radius: "rounded",
      shadow: "subtle",
      fontSize: "s",
      ...vfx,
    }}
  >
    {/* header row container */}
    <Box
      vfx={{
        axis: "x",
        gap: "m",
        paddingX: "m",
        padding: "s",
        justify: "start",
        align: "center",
        borderBottom: true,
      }}
    >
      {columns.map(({ key, header, cellProps }) => {
        const { vfx, ...rest } = cellProps || {};

        return (
          <Box
            {...rest}
            key={String(key)}
            vfx={{ fontWeight: 7, stretch: "even", ...vfx }}
          >
            {header}
          </Box>
        );
      })}
    </Box>
    <Box vfx={{ axis: "y" }}>
      {items.map((item) => {
        const children = columns.map(({ key, cellProps, render }) => {
          const { vfx, ...rest } = cellProps || {};
          const value = item[key];

          return (
            <Box {...rest} key={String(key)} vfx={{ stretch: "even", ...vfx }}>
              {render ? render(item) : <>{value}</>}
            </Box>
          );
        });
        const rowProps = {
          children,
          key: item.id,
          vfx: rowContainerVfx,
        } as const;
        if (routeTo) {
          const linkProps = routeTo(item);
          return <UnstyledLink {...linkProps} {...rowProps} />;
        }
        return <Box {...rowProps} />;
      })}
    </Box>
  </Box>
);

export default Table;
