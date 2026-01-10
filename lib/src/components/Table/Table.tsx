import React, { useState } from "react";

import classNames from "../../functions/classNames";
import { arrowDown, arrowUp, overflow, select } from "../../icons";
import { UnstyledLink } from "../../navigation/Link";
import type { ReadonlyableArray } from "../../types/common";
import type { BoxProps } from "../Box/Box";
import Box from "../Box/Box";
import { IconButton, UnstyledButton } from "../Button";
import Icon from "../Icon";
import Popover from "../Popover";

type LinkProps = React.ComponentProps<typeof UnstyledLink>;
type RouteLinkProps = Pick<LinkProps, "to" | "newTab">;
type ButtonProps = React.ComponentProps<typeof UnstyledButton>;
type BaseRowAction = {
  /** Content to render in the action node */
  label: React.ReactNode;
};
type RowLinkAction = BaseRowAction & RouteLinkProps;
type RowButtonAction = BaseRowAction &
  Pick<ButtonProps, "onClick" | "disabled">;
type RowAction = RowLinkAction | RowButtonAction;

type MinimalItem = {
  id: string;
};

type ContainerProps = Omit<BoxProps, "children">;

/** Options for data sort direction, used by `Table` */
export type SortDirection = "none" | "asc" | "desc";

type ColumnConfig<
  Item extends MinimalItem,
  Key extends keyof Item = keyof Item,
> = {
  /** The key in the item struct for this column */
  key: Key;
  /** What to render as the header */
  header: React.ReactNode;
  /** Custom render function for the inner cell content */
  render?: (item: Item) => React.ReactNode;
  /**
   * Whether this column is sortable.
   * @default false
   */
  sortable?: boolean;
  /** Additional props for the body cell container */
  cellProps?: ContainerProps;
};

type Props<Item extends MinimalItem> = ContainerProps & {
  /** Items to render in the rows of the table */
  items: ReadonlyableArray<Item>;
  /** Columns to render for each data item */
  columns: ReadonlyableArray<ColumnConfig<Item>>;
  /**
   * Additional props for each header cell container.
   * @default {}
   */
  headerCellProps?: ContainerProps;
  /** Options for controlled sorting of rows */
  sort?: {
    /** The key of the sorted column, or undefined if none */
    key: keyof Item | undefined;
    /** The current sort direction */
    direction: SortDirection;
    /** Callback to fire when the sort column/direction change */
    onSort: (key: keyof Item, direction: SortDirection) => void;
  };
  /** A single link, or list of actions or links to store in an overflow menu at the end of the row */
  rowActions?: (item: Item) => RouteLinkProps | ReadonlyableArray<RowAction>;
  /** Whether to render a small separator between columns */
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

const isRowActionList = (
  value: RouteLinkProps | ReadonlyableArray<RowAction> | undefined
): value is ReadonlyableArray<RowAction> => Array.isArray(value);

/** A sortable table to render data */
const Table = <Item extends MinimalItem>({
  items,
  columns,
  headerCellProps = {},
  sort,
  rowActions,
  vfx,
  gutters,
  ...boxProps
}: Props<Item>) => {
  const hasActionMenu =
    !!rowActions && items.some((item) => isRowActionList(rowActions(item)));

  return (
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
        {/* Header row */}
        <Box className="aui-table-row" role="row">
          {columns.map(({ key, header, sortable = false }, colIndex) => {
            const columnSorted = sortable && sort && sort.key === key;
            const direction = columnSorted ? sort.direction : "none";
            const icon = sortable ? directionToIcon[direction] : null;
            const { vfx, ...restHeaderCellProps } = headerCellProps;

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
          {hasActionMenu ? (
            <TableCell
              vfx={{
                borderBottom: true,
                paddingX: "s",
              }}
            />
          ) : null}
        </Box>
        {/* Rows */}
        {items.map((item) => (
          <TableBodyRow
            key={item.id}
            item={item}
            columns={columns}
            gutters={gutters}
            rowActions={rowActions}
          />
        ))}
      </Box>
    </Box>
  );
};

type TableBodyRowProps<Item extends MinimalItem> = Pick<
  Props<Item>,
  "columns" | "gutters" | "rowActions"
> & {
  item: Item;
};

const TableBodyRow = <Item extends MinimalItem>({
  item,
  columns,
  gutters,
  rowActions,
}: TableBodyRowProps<Item>) => {
  const rowActionValue = rowActions?.(item);
  const actions = isRowActionList(rowActionValue) ? rowActionValue : null;
  const rowLink =
    rowActionValue && !isRowActionList(rowActionValue)
      ? rowActionValue
      : undefined;

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

  if (actions) {
    children.push(
      <TableCell key="row-actions" vfx={{ paddingX: "s" }}>
        <RowActionsMenu rowActions={actions} />
      </TableCell>
    );
  }

  const rowProps = {
    role: "row",
    children,
  } as const;

  if (!rowLink) {
    return <Box {...rowProps} className="aui-table-row" />;
  }

  return (
    <UnstyledLink
      {...rowProps}
      {...rowLink}
      className="aui-table-row aui-subtle-hover"
    />
  );
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

const rowActionVfx = {
  axis: "x",
  align: "center",
  padding: "s",
  fontSize: "s",
  fontWeight: 6,
  radius: "rounded",
} as const;

const RowActionsMenu = ({
  rowActions,
}: {
  rowActions: ReadonlyableArray<RowAction>;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover
      flip={false}
      open={open}
      onClose={() => setOpen(false)}
      placement="bottom-end"
      offset={4}
      vfx={{ axis: "y", padding: "xs" }}
      anchor={
        <IconButton icon={overflow} onClick={() => setOpen((prev) => !prev)} />
      }
      to={{ opacity: 1, top: 0 }}
      from={{ opacity: 0, top: -4 }}
    >
      {rowActions.map(({ label, ...rowAction }, i) =>
        "to" in rowAction ? (
          <UnstyledLink
            {...rowAction}
            vfx={rowActionVfx}
            className="aui-subtle-hover"
            key={i}
          >
            {label}
          </UnstyledLink>
        ) : (
          <UnstyledButton
            onClick={rowAction.onClick}
            vfx={rowActionVfx}
            className="aui-subtle-hover"
            key={i}
          >
            {label}
          </UnstyledButton>
        )
      )}
    </Popover>
  );
};

export default Table;
