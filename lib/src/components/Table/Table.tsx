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

type Props<Item extends MinimalItem> = {
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
} & ContainerProps;

type TableCellProps = {
  children: React.ReactNode;
  borderRight?: boolean;
} & ContainerProps;

const TableCell = ({
  vfx,
  borderRight,
  children,
  className,
  ...rest
}: TableCellProps) => (
  <Box
    {...rest}
    className={classNames("aui-table-cell", className)}
    vfx={{ paddingX: "m", paddingY: "s", borderRight, ...vfx }}
  >
    {children}
  </Box>
);

const TableHeaderCell = ({
  vfx,
  borderRight,
  children,
  ...rest
}: TableCellProps) => (
  <TableCell
    {...rest}
    borderRight={borderRight}
    vfx={{ fontWeight: 7, fontSize: "s", borderBottom: true, ...vfx }}
  >
    <Box className="aui-table-header-cell">{children}</Box>
  </TableCell>
);

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
    <Box
      className="aui-table"
      role="table"
      vfx={{ minWidth: "max", width: "full" }}
    >
      <Box className="aui-table-header-group" role="rowgroup">
        <Box className="aui-table-row aui-table-header-row" role="row">
          {columns.map(({ key, header, sortable = false }, colIndex) => {
            const columnSorted = sortable && sort && sort.key === key;
            const direction = columnSorted ? sort.direction : "none";
            const icon = sortable ? directionToIcon[direction] : null;

            return (
              <TableHeaderCell
                {...headerCellProps}
                key={String(key)}
                borderRight={colIndex < columns.length - 1}
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
              </TableHeaderCell>
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
};

const TableBodyRow = <Item extends MinimalItem>({
  item,
  columns,
  getAction,
}: TableBodyRowProps<Item>) => {
  const action = getAction?.(item);

  const children = columns.map(({ key, cellProps, render }, colIndex) => (
    <TableCell
      {...cellProps}
      key={String(key)}
      borderRight={colIndex < columns.length - 1}
    >
      {render ? render(item) : <>{item[key]}</>}
    </TableCell>
  ));

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

export default Table;
