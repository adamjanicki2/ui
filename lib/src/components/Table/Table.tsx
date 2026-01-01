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
  /** Compute a URL that clicking on this row should navigate to */
  routeTo?: (item: Item) => RouteLinkProps;
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
  linkProps?: RouteLinkProps;
};

const TableRow = ({ children, linkProps }: TableRowProps) => {
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

  if (linkProps) {
    return (
      <UnstyledLink {...linkProps} {...rowProps} className="aui-table-row" />
    );
  }
  return <Box {...rowProps} />;
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
      {columns.map(({ key, header, sortable = false, cellProps = {} }) => {
        const { vfx, ...restCellProps } = cellProps;
        const columnSorted = sortable && sort && sort.key === key;
        const direction = columnSorted ? sort.direction : "none";
        const icon = sortable ? directionToIcon[direction] : null;

        return (
          <TableCell
            {...restCellProps}
            key={String(key)}
            vfx={{ fontWeight: 7, fontSize: "s", ...vfx }}
          >
            {sort && icon ? (
              <UnstyledButton
                onClick={() => sort.onSort(key, nextSortDirection[direction])}
                vfx={{ fontWeight: 7, axis: "x", align: "center", gap: "s" }}
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
      })}
    </Box>
    {/* Table body container */}
    <Box vfx={{ axis: "y" }}>
      {items.map((item) => (
        <TableRow key={item.id} linkProps={routeTo?.(item)}>
          {columns.map(({ key, cellProps, render }) => (
            <TableCell {...cellProps} key={String(key)}>
              {render ? render(item) : <>{item[key]}</>}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </Box>
  </Box>
);

export default Table;
