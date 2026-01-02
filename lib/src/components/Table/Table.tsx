import React from "react";
import type { ReadonlyableArray } from "../../types/common";
import type { BoxProps } from "../Box/Box";
import Box from "../Box/Box";
import { UnstyledLink } from "../../navigation/Link";
import Icon from "../Icon";
import { arrowDown, arrowUp, select } from "../../icons";
import { UnstyledButton } from "../Button";
import classNames from "../../functions/classNames";

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
  /** Additional props for the body cell container */
  cellProps?: ContainerProps;
};

type Props<Item extends MinimalItem> = ContainerProps & {
  /** Items to render in the rows of the table */
  items: ReadonlyableArray<Item>;
  /** Columns to render for each data item */
  columns: ReadonlyableArray<ColumnConfig<Item>>;
  /** Additional props for each header cell container */
  headerCellProps?: ContainerProps;
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
  /** Whether to render a small before between columns */
  gutters?: boolean;
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
  headerCellProps = {},
  sort,
  getAction,
  vfx,
  gutters,
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
    {/* Inner container (scrollable within parent) */}
    <Box className="aui-table" role="table" vfx={{ width: "full" }}>
      <Box className="aui-table-header-group" role="rowgroup">
        <Box className="aui-table-row" role="row">
          {columns.map(({ key, header, sortable = false }, colIndex) => {
            const columnSorted = sortable && sort && sort.key === key;
            const direction = columnSorted ? sort.direction : "none";
            const icon = sortable ? directionToIcon[direction] : null;
            const { vfx, style, ...restHeaderCellProps } = headerCellProps;

            return (
              <TableCell
                {...restHeaderCellProps}
                key={String(key)}
                vfx={{
                  borderRight: gutters && colIndex < columns.length - 1,
                  borderBottom: true,
                  fontSize: "s",
                  fontWeight: 7,
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
          })}
        </Box>
      </Box>

      <Box className="aui-table-body-group" role="rowgroup">
        {items.map((item) => (
          <TableBodyRow
            key={item.id}
            item={item}
            columns={columns}
            getAction={getAction}
            gutters={gutters}
          />
        ))}
      </Box>
    </Box>
  </Box>
);

type TableBodyRowProps<Item extends MinimalItem> = {
  item: Item;
  columns: ReadonlyableArray<ColumnConfig<Item>>;
  getAction?: (item: Item) => Action;
  gutters?: boolean;
};

const TableBodyRow = <Item extends MinimalItem>({
  item,
  columns,
  getAction,
  gutters,
}: TableBodyRowProps<Item>) => {
  const action = getAction?.(item);
  const children = columns.map(({ key, cellProps = {}, render }, colIndex) => {
    const { vfx, ...rest } = cellProps;
    return (
      <TableCell
        {...rest}
        key={String(key)}
        vfx={{
          borderRight: gutters && colIndex < columns.length - 1,
          ...vfx,
        }}
      >
        {render ? render(item) : <>{item[key]}</>}
      </TableCell>
    );
  });

  const baseRowProps = {
    role: "row",
    children,
  } as const;

  if (!action) {
    return <Box {...baseRowProps} className="aui-table-row" />;
  }

  const actionProps = {
    ...baseRowProps,
    ...action,
    className: "aui-table-row-action",
  } as const;

  if ("to" in actionProps) {
    return <UnstyledLink {...actionProps} />;
  }

  return <UnstyledButton {...actionProps} />;
};

const TableCell = ({ vfx, children, className, ...rest }: BoxProps) => (
  <Box
    {...rest}
    className={classNames("aui-table-cell", className)}
    vfx={{ paddingX: "m", paddingY: "s", ...vfx }}
  >
    {children}
  </Box>
);

export default Table;
