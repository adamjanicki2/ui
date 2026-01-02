import React from "react";
import type { ReadonlyableArray } from "../../types/common";
import type { BoxProps } from "../Box/Box";
import Box from "../Box/Box";
import { UnstyledLink } from "../../navigation/Link";
import Icon from "../Icon";
import { arrowDown, arrowUp, select } from "../../icons";
import { UnstyledButton } from "../Button";

type LinkProps = React.ComponentProps<typeof UnstyledLink>;
type RouteLinkProps = Pick<LinkProps, "to" | "newTab">;
type Action = RouteLinkProps | { onClick: () => void };

type MinimalItem = {
  id: string;
};

type ContainerProps = Omit<BoxProps, "children">;

export type SortDirection = "none" | "asc" | "desc";

type ColumnConfig<
  Item extends MinimalItem,
  Key extends keyof Item = keyof Item
> = {
  /** The key in the item struct for this column */
  key: Key;
  /** What to render as the header */
  header: React.ReactNode;
  /** Custom render function for the inner cell content */
  render?: (item: Item) => React.ReactNode;
  /** Whether this column is sortable */
  sortable?: boolean;
  /** Additional props for the cell container */
  cellProps?: ContainerProps;
};

type Props<Item extends MinimalItem> = {
  /** Items to render in the rows of the table */
  items: ReadonlyableArray<Item>;
  /** Columns to render for each data item */
  columns: ReadonlyableArray<ColumnConfig<Item>>;
  /**
   * Options for controlled sorting of rows
   */
  sort?: {
    /** The key of the sorted column, or undefined if none */
    key: keyof Item | undefined;
    /** The current sort direction */
    direction: SortDirection;
    /** Callback to fire when the sort column/direction change */
    onSort: (key: keyof Item, direction: SortDirection) => void;
  };
  /** A row's action can either be a URL or an onClick callback */
  getAction?: (item: Item) => Action;
} & ContainerProps;

type TableCellProps = {
  children: React.ReactNode;
} & ContainerProps;

const TableCell = ({ vfx, children, ...rest }: TableCellProps) => (
  <Box {...rest} vfx={{ stretch: "even", ...vfx }}>
    {children}
  </Box>
);

type TableRowProps = {
  children: React.ReactNode;
  action?: Action;
};

const TableRow = ({ children, action }: TableRowProps) => {
  const rowProps = {
    children,
    vfx: {
      axis: "x",
      gap: "m",
      paddingX: "m",
      paddingY: "s",
      justify: "start",
      align: "center",
    },
  } as const;

  if (!action) {
    return <Box {...rowProps} />;
  }

  const combinedProps = {
    ...rowProps,
    className: "aui-table-row",
    ...action,
  } as const;

  if ("to" in combinedProps) {
    return <UnstyledLink {...combinedProps} />;
  }
  return <UnstyledButton {...combinedProps} />;
};

const nextSortDirection = {
  none: "asc",
  asc: "desc",
  desc: "none",
} as const;

const directionToIcon = {
  asc: arrowUp,
  desc: arrowDown,
  none: select,
} as const;

const Table = <Item extends MinimalItem>({
  items,
  columns,
  sort,
  getAction,
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
      overflowX: "scroll",
      ...vfx,
    }}
  >
    {/* Extra box layer for overflow scrolling in main table box */}
    <Box vfx={{ axis: "y", minWidth: "max" }}>
      {/* header row container */}
      <Box
        vfx={{
          axis: "x",
          gap: "m",
          align: "center",
          paddingX: "m",
          borderBottom: true,
        }}
      >
        {columns.map(
          ({ key, header, sortable = false, cellProps = {} }, colIndex) => {
            const { vfx, ...restCellProps } = cellProps;
            const columnSorted = sortable && sort && sort.key === key;
            const direction = columnSorted ? sort.direction : "none";
            const icon = sortable ? directionToIcon[direction] : null;

            return (
              <TableCell
                {...restCellProps}
                key={String(key)}
                vfx={{
                  fontWeight: 7,
                  fontSize: "s",
                  paddingY: "s",
                  borderRight: colIndex < columns.length - 1,
                  ...vfx,
                }}
              >
                {sort && icon ? (
                  <UnstyledButton
                    onClick={() =>
                      sort.onSort(key, nextSortDirection[direction])
                    }
                    vfx={{
                      fontWeight: 7,
                      axis: "x",
                      align: "center",
                      gap: "s",
                    }}
                  >
                    {header}
                    {
                      <Icon
                        icon={icon}
                        vfx={{ color: "muted" }}
                        size="xs"
                        aria-hidden
                      />
                    }
                  </UnstyledButton>
                ) : (
                  header
                )}
              </TableCell>
            );
          }
        )}
      </Box>
      {/* Table body container */}
      <Box vfx={{ axis: "y" }}>
        {items.map((item) => (
          <TableRow key={item.id} action={getAction?.(item)}>
            {columns.map(({ key, cellProps, render }) => (
              <TableCell {...cellProps} key={String(key)}>
                {render ? render(item) : <>{item[key]}</>}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </Box>
    </Box>
  </Box>
);

export default Table;
