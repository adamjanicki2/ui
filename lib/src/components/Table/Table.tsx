import React from "react";
import type { ReadonlyableArray } from "../../types/common";
import type { BoxProps } from "../Box/Box";
import Box from "../Box/Box";

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
  items: ReadonlyableArray<Item>;
  columns: ReadonlyableArray<ColumnConfig<Item>>;
} & ContainerProps;

const Table = <Item extends MinimalItem>({
  items,
  columns,
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
      {items.map((item) => (
        // table row container
        <Box
          key={item.id}
          vfx={{
            axis: "x",
            gap: "m",
            paddingX: "m",
            paddingY: "s",
            justify: "start",
            align: "center",
          }}
        >
          {columns.map(({ key, cellProps, render }) => {
            const { vfx, ...rest } = cellProps || {};
            const value = item[key];

            return (
              <Box
                {...rest}
                key={String(key)}
                vfx={{ stretch: "even", ...vfx }}
              >
                {render ? render(item) : <>{value}</>}
              </Box>
            );
          })}
        </Box>
      ))}
    </Box>
  </Box>
);

export default Table;
