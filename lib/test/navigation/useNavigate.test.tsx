import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Router, useLocation, useNavigate } from "../../src";

type Props = {
  to: string;
  label: string;
};

function NavigateButton({ to, label }: Props) {
  const navigate = useNavigate();
  return (
    <button data-testid={`go-${label}`} onClick={() => navigate(to)}>
      Go {label}
    </button>
  );
}

function NavigateHistoryOffsetButton({
  historyOffset,
  label,
}: {
  historyOffset: number;
  label: string;
}) {
  const navigate = useNavigate();
  return (
    <button data-testid={`go-${label}`} onClick={() => navigate(historyOffset)}>
      Go {label}
    </button>
  );
}

function LocationView() {
  const location = useLocation();

  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="search">{location.search}</div>
      <div data-testid="hash">{location.hash}</div>
    </div>
  );
}

describe("useNavigate", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("works wiith an absolute URL and updates location", async () => {
    const user = userEvent.setup();

    render(
      <Router>
        <LocationView />
        <NavigateButton to="/a" label="a" />
        <NavigateButton to="/b?query=1#hash" label="b" />
      </Router>
    );

    expect(screen.getByTestId("pathname")).toHaveTextContent("/");

    await user.click(screen.getByTestId("go-a"));

    expect(window.location.pathname).toBe("/a");
    expect(window.location.search).toBe("");
    expect(window.location.hash).toBe("");

    expect(screen.getByTestId("pathname")).toHaveTextContent("/a");
    expect(screen.getByTestId("search")).toHaveTextContent("");
    expect(screen.getByTestId("hash")).toHaveTextContent("");

    await user.click(screen.getByTestId("go-b"));

    expect(window.location.pathname).toBe("/b");
    expect(window.location.search).toBe("?query=1");
    expect(window.location.hash).toBe("#hash");

    expect(screen.getByTestId("pathname")).toHaveTextContent("/b");
    expect(screen.getByTestId("search")).toHaveTextContent("?query=1");
    expect(screen.getByTestId("hash")).toHaveTextContent("#hash");
  });

  it("routes a non-absolute path on top of current pathname", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/base");

    render(
      <Router>
        <LocationView />
        <NavigateButton to="relative" label="relative" />
      </Router>
    );

    expect(screen.getByTestId("pathname")).toHaveTextContent("/base");

    await user.click(screen.getByTestId("go-relative"));

    expect(window.location.pathname).toBe("/base/relative");
    expect(screen.getByTestId("pathname")).toHaveTextContent("/base/relative");
  });

  it("routes a non-absolute path from the root pathname", async () => {
    const user = userEvent.setup();

    window.history.replaceState(null, "", "/");

    render(
      <Router>
        <LocationView />
        <NavigateButton to="relative" label="relative" />
      </Router>
    );

    await user.click(screen.getByTestId("go-relative"));

    expect(window.location.pathname).toBe("/relative");
    expect(screen.getByTestId("pathname")).toHaveTextContent("/relative");
  });

  it("throws a error when used outside <Router>", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    function Bad() {
      useNavigate();
      return null;
    }

    expect(() => render(<Bad />)).toThrow(
      "useNavigate() must be used inside of a <Router> component"
    );

    consoleError.mockRestore();
  });

  it("supports basename", async () => {
    const user = userEvent.setup();

    render(
      <Router basename="/app">
        <LocationView />
        <NavigateButton to="/a" label="a" />
      </Router>
    );

    await user.click(screen.getByTestId("go-a"));

    expect(window.location.pathname).toBe("/app/a");
    expect(screen.getByTestId("pathname")).toHaveTextContent("/app/a");
  });

  it("supports basename with non-absolute paths", async () => {
    const user = userEvent.setup();

    window.history.replaceState(null, "", "/app/base");

    render(
      <Router basename="/app">
        <LocationView />
        <NavigateButton to="relative" label="relative" />
      </Router>
    );

    await user.click(screen.getByTestId("go-relative"));

    expect(window.location.pathname).toBe("/app/base/relative");
    expect(screen.getByTestId("pathname")).toHaveTextContent(
      "/app/base/relative"
    );
  });

  it("supports navigating backwards with a history offset", async () => {
    const user = userEvent.setup();
    const goSpy = jest.spyOn(window.history, "go");

    render(
      <Router>
        <NavigateButton to="/a" label="a" />
        <NavigateHistoryOffsetButton historyOffset={-1} label="back" />
      </Router>
    );

    await user.click(screen.getByTestId("go-a"));
    await user.click(screen.getByTestId("go-back"));

    expect(goSpy).toHaveBeenCalledWith(-1);

    goSpy.mockRestore();
  });
});
