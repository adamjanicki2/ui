import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { useMemo, useState } from "react";
import { Table } from "../../src";
import { arrowDown, arrowUp, select } from "../../src/icons";

type Movie = {
  id: string;
  title: string;
  year: number;
};

const movies: Movie[] = [
  { id: "1", title: "Interstellar", year: 2014 },
  { id: "2", title: "Alien", year: 1979 },
];

describe("Table", () => {
  it("renders headers and rows", () => {
    render(
      <Table
        items={movies}
        columns={[
          { key: "title", header: "Title" },
          { key: "year", header: "Year" },
        ]}
      />
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.getByText("Interstellar")).toBeInTheDocument();
    expect(screen.getByText("Alien")).toBeInTheDocument();
  });

  it("wraps rows with links", () => {
    render(
      <Table
        items={movies}
        columns={[
          { key: "title", header: "Title" },
          { key: "year", header: "Year" },
        ]}
        routeTo={(movie) => ({ to: `/movies/${movie.id}` })}
      />
    );

    const link = screen
      .getByText("Interstellar")
      .closest("a") as HTMLAnchorElement;
    expect(link.getAttribute("href")).toBe("/movies/1");
  });

  it("uses custom render when provided", () => {
    const renderYear = jest.fn((item: Movie) => (
      <span data-testid={`year-${item.id}`}>{item.year}</span>
    ));

    render(
      <Table
        items={movies}
        columns={[
          { key: "title", header: "Title" },
          { key: "year", header: "Year", render: renderYear },
        ]}
      />
    );

    movies.forEach((movie) =>
      expect(screen.getByTestId(`year-${movie.id}`)).toHaveTextContent(
        String(movie.year)
      )
    );
    expect(renderYear).toHaveBeenCalledTimes(movies.length);
  });

  it("respects custom renderers, cellProps, and ordering", () => {
    const renderTitle = jest.fn((item: Movie) => (
      <strong data-testid={`title-${item.id}`}>
        {item.title.toUpperCase()}
      </strong>
    ));
    const customClass = "custom-cell";

    render(
      <Table
        data-testid="table"
        vfx={{ padding: "m" }}
        items={movies}
        columns={[
          {
            key: "year",
            header: "Year",
            render: (item) => (
              <span data-testid={`year-${item.id}`}>{item.year}</span>
            ),
            cellProps: { className: customClass },
          },
          {
            key: "title",
            header: "Title",
            render: renderTitle,
            cellProps: { vfx: { stretch: "min" } },
          },
        ]}
      />
    );

    // Header order follows columns array
    const headers = screen.getAllByText(/^(Year|Title)$/);
    expect(headers[0]).toHaveTextContent("Year");
    expect(headers[1]).toHaveTextContent("Title");

    // Custom renderers output
    movies.forEach((movie) => {
      expect(screen.getByTestId(`year-${movie.id}`)).toHaveTextContent(
        String(movie.year)
      );
      expect(screen.getByTestId(`title-${movie.id}`)).toHaveTextContent(
        movie.title.toUpperCase()
      );
    });

    // cellProps class applied to year cells
    const yearCells = screen
      .getAllByTestId(/year-/)
      .map((el) => el.parentElement);
    yearCells.forEach((cell) => expect(cell).toHaveClass(customClass));

    expect(renderTitle).toHaveBeenCalledTimes(movies.length);
  });

  it("sorts rows when clicking a sortable header", async () => {
    type SortKey = "title" | "year";

    const SortableTable = () => {
      const [sortKey, setSortKey] = useState<SortKey>();
      const [sortDirection, setSortDirection] = useState<
        "none" | "asc" | "desc"
      >("none");

      const sortedItems = useMemo(() => {
        if (!sortKey || sortDirection === "none") return movies;
        const sorted = [...movies].sort((a, b) => {
          const aValue = a[sortKey];
          const bValue = b[sortKey];
          if (aValue === bValue) return 0;
          return aValue > bValue ? 1 : -1;
        });
        return sortDirection === "asc" ? sorted : sorted.reverse();
      }, [sortDirection, sortKey]);

      return (
        <Table
          items={sortedItems}
          columns={[
            { key: "title", header: "Title", sortable: true },
            { key: "year", header: "Year", sortable: true },
          ]}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={(key, direction) => {
            setSortDirection(direction);
            setSortKey(direction === "none" ? undefined : (key as SortKey));
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<SortableTable />);

    const yearHeaderButton = screen.getByRole("button", { name: "Year" });
    const getYearIconPath = () =>
      yearHeaderButton.querySelector("path")?.getAttribute("d");

    // No sort => original order + "select" icon.
    expect(
      screen
        .getByText("Interstellar")
        .compareDocumentPosition(screen.getByText("Alien")) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(getYearIconPath()).toBe(select);

    // none -> asc
    await user.click(yearHeaderButton);
    expect(
      screen
        .getByText("Alien")
        .compareDocumentPosition(screen.getByText("Interstellar")) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(getYearIconPath()).toBe(arrowUp);

    // asc -> desc
    await user.click(yearHeaderButton);
    expect(
      screen
        .getByText("Interstellar")
        .compareDocumentPosition(screen.getByText("Alien")) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(getYearIconPath()).toBe(arrowDown);

    // desc -> none
    await user.click(yearHeaderButton);
    expect(
      screen
        .getByText("Interstellar")
        .compareDocumentPosition(screen.getByText("Alien")) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(getYearIconPath()).toBe(select);
  });
});
