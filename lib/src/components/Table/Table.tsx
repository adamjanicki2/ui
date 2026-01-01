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
  key: Key;
  header: React.ReactNode;
  render?: (item: Item) => React.ReactNode;
  sortable?: boolean;
  cellProps?: ContainerProps;
};

type Props<Item extends MinimalItem> = {
  /** Items to render in the rows of the table */
  items: ReadonlyableArray<Item>;
  /** Columns to render for each data item */
  columns: ReadonlyableArray<ColumnConfig<Item>>;
  /** Currently-sorted column key (controlled) */
  sortKey?: keyof Item;
  /** Current sort direction (controlled) */
  sortDirection?: SortDirection;
  /** Callback fired when a sortable header is clicked (controlled) */
  onSort?: (key: keyof Item, direction: SortDirection) => void;
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
    return <UnstyledLink {...linkProps} {...rowProps} />;
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
  sortKey,
  sortDirection = "none",
  onSort,
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
        const columnSorted = sortable && sortKey === key;
        const direction = columnSorted ? sortDirection : "none";
        const icon = sortable ? directionToIcon[direction] : null;

        return (
          <TableCell
            {...restCellProps}
            key={String(key)}
            vfx={{ fontWeight: 7, fontSize: "s", ...vfx }}
          >
            {sortable ? (
              <UnstyledButton
                type="button"
                disabled={!onSort}
                onClick={() => onSort?.(key, nextSortDirection[direction])}
                vfx={{ fontWeight: 7, axis: "x", align: "center", gap: "s" }}
              >
                {header}
                {icon ? (
                  <Icon
                    icon={icon}
                    vfx={{ color: "muted" }}
                    size="xs"
                    aria-hidden
                  />
                ) : null}
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
