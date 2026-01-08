import { render, screen } from "@testing-library/react";

import { Route, Router, Routes } from "../../src";

function Page({ name }: { name: string }) {
  return <div data-testid="page">{name}</div>;
}

describe("Routes", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("renders the first matching static route", () => {
    window.history.replaceState(null, "", "/about");

    render(
      <Router>
        <Routes>
          <Route path="/" element={<Page name="home" />} />
          <Route path="/about" element={<Page name="about" />} />
          <Route path="/about" element={<Page name="other" />} />
        </Routes>
      </Router>
    );

    expect(screen.getByTestId("page")).toHaveTextContent("about");
  });

  it("renders a route nested in fragments", () => {
    window.history.replaceState(null, "", "/about");

    render(
      <Router>
        <Routes>
          <Route path="/" element={<Page name="home" />} />
          <>
            <>
              <Route path="/about" element={<Page name="about" />} />
            </>
          </>
        </Routes>
      </Router>
    );

    expect(screen.getByTestId("page")).toHaveTextContent("about");
  });

  it("renders nothing when no route matches and no fallback used", () => {
    window.history.replaceState(null, "", "/404");

    const { container } = render(
      <Router>
        <Routes>
          <Route path="/" element={<Page name="home" />} />
          <Route path="/about" element={<Page name="about" />} />
        </Routes>
      </Router>
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders fallback when no route matches", () => {
    window.history.replaceState(null, "", "/404");

    render(
      <Router>
        <Routes fallback={<Page name="missing" />}>
          <Route path="/" element={<Page name="home" />} />
          <Route path="/about" element={<Page name="about" />} />
        </Routes>
      </Router>
    );

    expect(screen.getByTestId("page")).toHaveTextContent("missing");
  });

  it("throws error without Router context", () => {
    window.history.replaceState(null, "", "/about");

    expect(() =>
      render(
        <Routes>
          <Route path="/" element={<Page name="home" />} />
          <Route path="/about" element={<Page name="about" />} />
        </Routes>
      )
    ).toThrow();
  });

  it("strips basename before matching", () => {
    window.history.replaceState(null, "", "/app/about");

    render(
      <Router basename="app">
        <Routes>
          <Route path="about" element={<Page name="about" />} />
        </Routes>
      </Router>
    );

    expect(screen.getByTestId("page")).toHaveTextContent("about");
  });
});
