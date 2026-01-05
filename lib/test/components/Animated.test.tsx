import { act, render, screen } from "@testing-library/react";
import Animated from "../../src/components/Animated";

function flushPromises() {
  return act(async () => {});
}

describe("Animated", () => {
  beforeEach(() => {
    jest.useFakeTimers();

    jest
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb: FrameRequestCallback) =>
        window.setTimeout(() => cb(0), 0)
      );

    jest.spyOn(window, "cancelAnimationFrame").mockImplementation((id) => {
      clearTimeout(id);
    });
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  function flushRaf() {
    act(() => {
      jest.advanceTimersByTime(0);
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
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
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
        transitionProperties={["opacity"]}
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
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
        transitionProperties={["opacity"]}
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    // The scheduled RAF should be canceled by effect cleanup.
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
        transitionProperties={["opacity"]}
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
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
        transitionProperties={["opacity"]}
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    // Reverse phase is mounted and uses animateFrom.
    const el = screen.getByTestId("animated");
    expect(el).toHaveStyle({ opacity: "0" });
    expect(el).toHaveStyle({ transition: "opacity 0.25s ease-in-out" });

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
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
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
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
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
    // After completing reverse, phase should be "from" => animateFrom styles.
    expect(screen.getByTestId("animated")).toHaveStyle({ opacity: "0" });
  });

  it("closes instantly with instant reverse duration", async () => {
    const { rerender } = render(
      <Animated
        visible
        duration={{ forward: 0, reverse: 0 }}
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    rerender(
      <Animated
        visible={false}
        duration={{ forward: 0, reverse: 0 }}
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
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
        transitionProperties={["opacity"]}
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
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
        transitionProperties={["opacity"]}
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
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
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    rerender(
      <Animated
        visible={false}
        duration={{ forward: 0, reverse: 0.25 }}
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    // A reverse timer should be scheduled.
    expect(jest.getTimerCount()).toBeGreaterThan(0);

    // Reopen before the reverse completes.
    rerender(
      <Animated
        visible
        duration={{ forward: 0, reverse: 0.25 }}
        animateTo={{ style: { opacity: 1 } }}
        animateFrom={{ style: { opacity: 0 } }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    act(() => {
      jest.runOnlyPendingTimers();
    });
    await flushPromises();

    expect(screen.getByTestId("animated")).toBeInTheDocument();
  });

  it("builds transition string", async () => {
    render(
      <Animated
        visible
        duration={0.4}
        transitionProperties={["opacity", "transform"]}
        animateTo={{ style: { opacity: 1, transform: "translateY(0px)" } }}
        animateFrom={{ style: { opacity: 0, transform: "translateY(10px)" } }}
        data-testid="animated"
      >
        Child
      </Animated>
    );

    flushRaf();
    await flushPromises();

    expect(screen.getByTestId("animated")).toHaveStyle({
      transition: "opacity 0.4s ease-in-out, transform 0.4s ease-in-out",
    });
  });
});
