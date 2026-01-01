import { fireEvent, render, screen } from "@testing-library/react";
import { Table } from "../../src";
import RouterContext from "../../src/navigation/RouterContext";

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
});
