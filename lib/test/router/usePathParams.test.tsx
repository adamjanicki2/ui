import { render, screen } from "@testing-library/react";
import { Router, Routes, Route, usePathParams } from "../../src";

function Page({ name }: { name: string }) {
  const params = usePathParams();

  return (
    <div>
      <div data-testid="page">{name}</div>
      <div data-testid="params">{JSON.stringify(params)}</div>
    </div>
  );
}

describe("usePathParams", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("works for static route", () => {
    window.history.replaceState(null, "", "/movie/");

    render(
      <Router>
        <Routes>
          <Route path="/movie/:title" element={<Page name="movie" />} />
          <Route path="/movie/" element={<Page name="landing" />} />
        </Routes>
      </Router>
    );

    expect(screen.getByTestId("page")).toHaveTextContent("landing");
    expect(screen.getByTestId("params")).toHaveTextContent(JSON.stringify({}));
  });

  it("works for dynamic route", () => {
    window.history.replaceState(null, "", "/movie/inception");

    render(
      <Router>
        <Routes>
          <Route path="/" element={<Page name="home" />} />
          <Route path="/movie/:title" element={<Page name="movie" />} />
        </Routes>
      </Router>
    );

    expect(screen.getByTestId("page")).toHaveTextContent("movie");
    expect(screen.getByTestId("params")).toHaveTextContent(
      JSON.stringify({ title: "inception" })
    );
  });

  it("works with multiple params", () => {
    window.history.replaceState(null, "", "/movie/alien/reviews/1979");

    render(
      <Router>
        <Routes>
          <Route
            path="/movie/alien/reviews/"
            element={<Page name="incorrect" />}
          />
          <Route
            path="/movie/:title/reviews/:year"
            element={<Page name="movie" />}
          />
        </Routes>
      </Router>
    );

    expect(screen.getByTestId("page")).toHaveTextContent("movie");
    expect(screen.getByTestId("params")).toHaveTextContent(
      JSON.stringify({ title: "alien", year: "1979" })
    );
  });

  it("throws error used outside a router", () => {
    expect(() =>
      render(
        <Routes>
          <Route path="/" element={<Page name="page" />} />
        </Routes>
      )
    ).toThrow();
  });
});
