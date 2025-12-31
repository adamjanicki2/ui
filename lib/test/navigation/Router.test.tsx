import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import { Router, useLocation, useNavigate } from "../../src";

function LocationRenderer() {
  const location = useLocation();
  return (
    <div>
      <div data-testid="pathname">{location.pathname}</div>
      <div data-testid="search">{location.search}</div>
      <div data-testid="hash">{location.hash}</div>
    </div>
  );
}

function NavigateOnMount({ to }: { to: string }) {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate(to);
  }, [navigate, to]);

  return null;
}

describe("Router", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
    (window.scrollTo as jest.MockedFunction<typeof window.scrollTo>).mockClear?.();
  });

  it("renders children", () => {
    render(
      <Router>
        <div data-testid="child">Child</div>
      </Router>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("initializes its location from window.location", () => {
    window.history.replaceState(null, "", "/initial?query=1#hash");

    render(
      <Router>
        <LocationRenderer />
      </Router>
    );

    expect(screen.getByTestId("pathname")).toHaveTextContent("/initial");
    expect(screen.getByTestId("search")).toHaveTextContent("?query=1");
    expect(screen.getByTestId("hash")).toHaveTextContent("#hash");
  });

  it("responds to browser popstate events by updating location", () => {
    render(
      <Router>
        <LocationRenderer />
      </Router>
    );

    expect(screen.getByTestId("pathname")).toHaveTextContent("/");

    act(() => {
      window.history.replaceState(null, "", "/next?query=1#hash");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(screen.getByTestId("pathname")).toHaveTextContent("/next");
    expect(screen.getByTestId("search")).toHaveTextContent("?query=1");
    expect(screen.getByTestId("hash")).toHaveTextContent("#hash");
  });

  it("provides a stable navigation function", () => {
    const navigateIdentities: unknown[] = [];

    function CaptureNavigateIdentity() {
      const navigate = useNavigate();
      navigateIdentities.push(navigate);
      return null;
    }

    render(
      <Router>
        <CaptureNavigateIdentity />
        <LocationRenderer />
      </Router>
    );

    // Trigger a location update (causing rerender)
    act(() => {
      window.history.replaceState(null, "", "/changed");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(navigateIdentities.length).toBeGreaterThanOrEqual(2);
    expect(navigateIdentities[0]).toBe(navigateIdentities[1]);
  });

  it("cleans up popstate listeners on unmount (no updates after unmount)", () => {
    const effectCallback = jest.fn();

    function EffectProbe() {
      const location = useLocation();
      React.useEffect(() => {
        effectCallback(location.pathname);
      }, [location.pathname]);
      return null;
    }

    const { unmount } = render(
      <Router>
        <EffectProbe />
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

  it("applies basename when navigation is triggered", async () => {
    window.history.replaceState(null, "", "/app");

    render(
      <Router basename="/app">
        <LocationRenderer />
        <NavigateOnMount to="/a" />
      </Router>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe("/app/a");
      expect(screen.getByTestId("pathname")).toHaveTextContent("/app/a");
    });

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("normalizes basename (trailing slash) and applies it exactly once", () => {
    window.history.replaceState(null, "", "/app/base");

    render(
      <Router basename="/app/">
        <LocationRenderer />
        <NavigateOnMount to="relative" />
      </Router>
    );

    // Relative navigation should not duplicate basename.
    expect(window.location.pathname).toBe("/app/base/relative");
    expect(screen.getByTestId("pathname")).toHaveTextContent(
      "/app/base/relative"
    );
  });
});
