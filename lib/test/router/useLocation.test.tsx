import React from "react";
import { render, screen, act } from "@testing-library/react";
import { Router, useLocation } from "../../src";

function Wrapper() {
  const location = useLocation();

  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="search">{location.search}</div>
      <div data-testid="hash">{location.hash}</div>
    </div>
  );
}

describe("useLocation", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("returns initial location", () => {
    window.history.replaceState(null, "", "/initial?query=1#section");

    render(
      <Router>
        <Wrapper />
      </Router>
    );

    expect(screen.getByTestId("pathname")).toHaveTextContent("/initial");
    expect(screen.getByTestId("search")).toHaveTextContent("?query=1");
    expect(screen.getByTestId("hash")).toHaveTextContent("#section");
  });

  it("updates when a popstate event occurs and location has changed", () => {
    render(
      <Router>
        <Wrapper />
      </Router>
    );

    expect(screen.getByTestId("pathname")).toHaveTextContent("/");

    act(() => {
      window.history.replaceState(null, "", "/path?query=1#hash");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(screen.getByTestId("pathname")).toHaveTextContent("/path");
    expect(screen.getByTestId("search")).toHaveTextContent("?query=1");
    expect(screen.getByTestId("hash")).toHaveTextContent("#hash");
  });

  it("throws error when used outside Router context", () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => render(<Wrapper />)).toThrow(
      "This hook must be used within a <Router>"
    );

    consoleError.mockRestore();
  });

  it("does not update after the router is unmounted", () => {
    const effectCallback = jest.fn();

    function Wrapper() {
      const location = useLocation();

      React.useEffect(() => {
        effectCallback(location.pathname);
      }, [location.pathname]);

      return <div>{location.pathname}</div>;
    }

    const { unmount } = render(
      <Router>
        <Wrapper />
      </Router>
    );

    expect(effectCallback).toHaveBeenCalledTimes(1);
    expect(effectCallback).toHaveBeenLastCalledWith("/");

    unmount();

    act(() => {
      window.history.replaceState(null, "", "/after-unmount");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(effectCallback).toHaveBeenCalledTimes(1);
  });
});
