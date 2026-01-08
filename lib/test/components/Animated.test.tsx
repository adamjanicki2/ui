import { act, render, screen } from "@testing-library/react";
import Animated from "../../src/components/Animated";

function flushPromises() {
  return act(async () => {});
}

describe("Animated", () => {
  let rafCallbacks: Map<number, FrameRequestCallback>;
  let rafId: number;

  beforeEach(() => {
    jest.useFakeTimers();

    rafCallbacks = new Map();
    rafId = 0;

    jest.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
      rafId += 1;
      rafCallbacks.set(rafId, cb);
      return rafId;
    });

    jest.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
      rafCallbacks.delete(id);
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  function flushRaf() {
    act(() => {
      const callbacks = Array.from(rafCallbacks.entries());
      rafCallbacks.clear();
      for (const [, cb] of callbacks) cb(0);
    });
  }

  it("does not render when visible=false and keepMounted=false", () => {
    render(
      <Animated visible={false} data-testid="animated">
        Child
      </Animated>
    );

    expect(screen.queryByTestId("animated")).toBeNull();
    expect(screen.queryByText("Child")).toBeNull();
  });

  it("keeps mounted when keepMounted=true and visible=false", () => {
    render(
      <Animated visible={false} keepMounted data-testid="animated">
        Child
      </Animated>
    );

    expect(screen.getByTestId("animated")).toBeInTheDocument();
    expect(screen.getByText("Child")).toBeInTheDocument();
  });

  it("starts in forward phase for instant forward when visible=true", () => {
    render(
      <Animated
        visible
        duration={0}
        to={{ opacity: 1 }}
        from={{ opacity: 0 }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    const el = screen.getByTestId("animated");
    expect(el).toHaveStyle({ opacity: "1" });
    expect(el).not.toHaveStyle({ transition: expect.any(String) });
  });

  it("cancels pending animation frame if it becomes invisible", async () => {
    const { rerender } = render(
      <Animated
        visible
        duration={0.5}
        to={{ opacity: 1 }}
        from={{ opacity: 0 }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);

    rerender(
      <Animated
        visible={false}
        duration={0.5}
        to={{ opacity: 1 }}
        from={{ opacity: 0 }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(1);

    flushRaf();
    await flushPromises();

    expect(screen.queryByTestId("animated")).toBeNull();
  });

  it("transitions to reverse and unmounts after non-instant reverse duration when keepMounted=false", async () => {
    const { rerender } = render(
      <Animated
        visible
        duration={{ forward: 0, reverse: 0.25 }}
        to={{ opacity: 1 }}
        from={{ opacity: 0 }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    expect(screen.getByTestId("animated")).toHaveStyle({ opacity: "1" });

    rerender(
      <Animated
        visible={false}
        duration={{ forward: 0, reverse: 0.25 }}
        to={{ opacity: 1 }}
        from={{ opacity: 0 }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    const el = screen.getByTestId("animated");
    expect(el).toHaveStyle({ opacity: "0" });
    expect(el).toHaveStyle({
      transitionProperty: "opacity",
      transitionDuration: "0.25s",
    });

    act(() => {
      jest.advanceTimersByTime(249);
    });
    expect(screen.getByTestId("animated")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(1);
    });
    await flushPromises();

    expect(screen.queryByTestId("animated")).toBeNull();
  });

  it("does not unmount after reverse when keepMounted=true", async () => {
    const { rerender } = render(
      <Animated
        visible
        keepMounted
        duration={{ forward: 0, reverse: 0.25 }}
        to={{ opacity: 1 }}
        from={{ opacity: 0 }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    rerender(
      <Animated
        visible={false}
        keepMounted
        duration={{ forward: 0, reverse: 0.25 }}
        to={{ opacity: 1 }}
        from={{ opacity: 0 }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    act(() => {
      jest.advanceTimersByTime(250);
    });
    await flushPromises();

    expect(screen.getByTestId("animated")).toBeInTheDocument();
    expect(screen.getByTestId("animated")).toHaveStyle({ opacity: "0" });
  });

  it("closes instantly with instant reverse duration", async () => {
    const { rerender } = render(
      <Animated
        visible
        duration={{ forward: 0, reverse: 0 }}
        to={{ opacity: 1 }}
        from={{ opacity: 0 }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    rerender(
      <Animated
        visible={false}
        duration={{ forward: 0, reverse: 0 }}
        to={{ opacity: 1 }}
        from={{ opacity: 0 }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    await flushPromises();
    expect(screen.queryByTestId("animated")).toBeNull();
  });

  it("closes instantly with instant reverse even if open duration is non-instant", async () => {
    const { rerender } = render(
      <Animated
        visible
        duration={{ forward: 0.5, reverse: 0 }}
        to={{ opacity: 1 }}
        from={{ opacity: 0 }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    flushRaf();
    await flushPromises();

    expect(screen.getByTestId("animated")).toHaveStyle({ opacity: "1" });

    rerender(
      <Animated
        visible={false}
        duration={{ forward: 0.5, reverse: 0 }}
        to={{ opacity: 1 }}
        from={{ opacity: 0 }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    await flushPromises();
    expect(screen.queryByTestId("animated")).toBeNull();
  });

  it("cancels reverse timeout if reopened before it completes", async () => {
    const { rerender } = render(
      <Animated
        visible
        duration={{ forward: 0, reverse: 0.25 }}
        to={{ opacity: 1 }}
        from={{ opacity: 0 }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    rerender(
      <Animated
        visible={false}
        duration={{ forward: 0, reverse: 0.25 }}
        to={{ opacity: 1 }}
        from={{ opacity: 0 }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    rerender(
      <Animated
        visible
        duration={{ forward: 0, reverse: 0.25 }}
        to={{ opacity: 1 }}
        from={{ opacity: 0 }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    act(() => {
      jest.advanceTimersByTime(250);
    });
    await flushPromises();

    expect(screen.getByTestId("animated")).toBeInTheDocument();
    expect(screen.getByTestId("animated")).toHaveStyle({ opacity: "1" });
  });

  it("builds transition string", async () => {
    render(
      <Animated
        visible
        duration={0.4}
        to={{ opacity: 1, transform: "translateY(0px)" }}
        from={{ opacity: 0, transform: "translateY(10px)" }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    flushRaf();
    await flushPromises();

    expect(screen.getByTestId("animated")).toHaveStyle({
      transitionProperty: "opacity, transform",
      transitionDuration: "0.4s",
    });
  });
});
