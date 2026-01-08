import { act, render, screen, waitFor } from "@testing-library/react";
import React from "react";

import { Router, useLocation, useNavigate } from "../../src";
import type { NavigateOptions } from "../../src/types/navigation";

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

function Redirect({ to, options }: { to: string; options?: NavigateOptions }) {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate(to, options);
  }, [navigate, options, to]);

  return null;
}

describe("Router", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
    (
      window.scrollTo as jest.MockedFunction<typeof window.scrollTo>
    ).mockClear?.();
    window.history.scrollRestoration = "auto";
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
        <LocationView />
      </Router>
    );

    expect(screen.getByTestId("pathname")).toHaveTextContent("/initial");
    expect(screen.getByTestId("search")).toHaveTextContent("?query=1");
    expect(screen.getByTestId("hash")).toHaveTextContent("#hash");
  });

  it("responds to browser popstate events by updating location", () => {
    render(
      <Router>
        <LocationView />
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
    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });

  it("does not scroll to top when only search and hash change", () => {
    render(
      <Router>
        <LocationView />
      </Router>
    );

    act(() => {
      window.history.replaceState(null, "", "/?query=1#hash");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(screen.getByTestId("pathname")).toHaveTextContent("/");
    expect(screen.getByTestId("search")).toHaveTextContent("?query=1");
    expect(screen.getByTestId("hash")).toHaveTextContent("#hash");
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("sets scrollRestoration to manual on mount and restores it on unmount", async () => {
    const { unmount } = render(
      <Router>
        <LocationView />
      </Router>
    );

    expect(window.history.scrollRestoration).toBe("manual");

    act(() => unmount());

    await waitFor(() => {
      expect(window.history.scrollRestoration).toBe("auto");
    });
  });

  it("restores scrollRestoration when resetScroll toggles to false", async () => {
    function Wrapper() {
      const [resetScroll, setResetScroll] = React.useState(true);
      return (
        <>
          <button type="button" onClick={() => setResetScroll(false)}>
            Toggle
          </button>
          <Router resetScroll={resetScroll}>
            <LocationView />
          </Router>
        </>
      );
    }

    render(<Wrapper />);

    expect(window.history.scrollRestoration).toBe("manual");

    act(() => {
      screen.getByRole("button", { name: "Toggle" }).click();
    });

    await waitFor(() => {
      expect(window.history.scrollRestoration).toBe("auto");
    });
  });

  it("does not touch scrollRestoration when resetScroll is false", () => {
    const { unmount } = render(
      <Router resetScroll={false}>
        <LocationView />
      </Router>
    );

    expect(window.history.scrollRestoration).toBe("auto");

    act(() => unmount());

    expect(window.history.scrollRestoration).toBe("auto");
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
        <LocationView />
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

  it("cleans up listeners on unmount", () => {
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
        <LocationView />
        <Redirect to="/a" />
      </Router>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe("/app/a");
      expect(screen.getByTestId("pathname")).toHaveTextContent("/app/a");
    });

    expect(window.scrollTo).toHaveBeenCalledTimes(1);
  });

  it("supports replace navigation", async () => {
    const pushStateSpy = jest.spyOn(window.history, "pushState");
    const replaceStateSpy = jest.spyOn(window.history, "replaceState");

    render(
      <Router>
        <LocationView />
        <Redirect to="/replaced" options={{ historyMode: "replace" }} />
      </Router>
    );

    await waitFor(() => {
      expect(window.location.pathname).toBe("/replaced");
      expect(screen.getByTestId("pathname")).toHaveTextContent("/replaced");
    });

    expect(window.scrollTo).toHaveBeenCalledTimes(1);

    expect(replaceStateSpy).toHaveBeenCalledTimes(1);
    expect(pushStateSpy).not.toHaveBeenCalled();

    pushStateSpy.mockRestore();
    replaceStateSpy.mockRestore();
  });

  it("normalizes basename", () => {
    window.history.replaceState(null, "", "/app/base");

    render(
      <Router basename="/app/" resetScroll={false}>
        <LocationView />
        <Redirect to="relative" />
      </Router>
    );

    expect(window.location.pathname).toBe("/app/base/relative");
    expect(screen.getByTestId("pathname")).toHaveTextContent(
      "/app/base/relative"
    );
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
