import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Router, useSearchParams } from "../../src";

function formatValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value.join(",") : `${value}`;
}

function Wrapper() {
  const [params, setParams] = useSearchParams();

  return (
    <div>
      <div data-testid="tag">{formatValue(params.tag)}</div>
      <div data-testid="page">{formatValue(params.page)}</div>

      <button
        onClick={() => setParams({ tag: ["a", "b"], page: "2" })}
        data-testid="set-array"
      >
        set array
      </button>

      <button
        onClick={() =>
          setParams((prev) => {
            const tag = prev.tag;
            const nextTags =
              tag === undefined
                ? ["x"]
                : Array.isArray(tag)
                ? [...tag, "x"]
                : [tag, "x"];

            return { ...prev, tag: nextTags };
          })
        }
        data-testid="append-tag"
      >
        append tag
      </button>

      <button
        onClick={() => setParams({ ...params, tag: undefined })}
        data-testid="remove-tag"
      >
        remove tag
      </button>

      <button
        onClick={() => setParams({ tag: ["z"], page: undefined })}
        data-testid="set-and-remove"
      >
        set and remove
      </button>
    </div>
  );
}

describe("useSearchParams", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  it("parses handles duplicate keys", () => {
    window.history.replaceState(null, "", "/test?tag=a&tag=b&page=1");

    render(
      <Router>
        <Wrapper />
      </Router>
    );

    expect(screen.getByTestId("tag")).toHaveTextContent("a,b");
    expect(screen.getByTestId("page")).toHaveTextContent("1");
  });

  it("sets params and updates the URL", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/test?page=1");

    render(
      <Router>
        <Wrapper />
      </Router>
    );

    await user.click(screen.getByTestId("set-array"));

    expect(window.location.search).toBe("?tag=a&tag=b&page=2");
    expect(screen.getByTestId("tag")).toHaveTextContent("a,b");
    expect(screen.getByTestId("page")).toHaveTextContent("2");
  });

  it("supports appending duplicates", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/test?tag=a&page=1");

    render(
      <Router>
        <Wrapper />
      </Router>
    );

    await user.click(screen.getByTestId("append-tag"));
    expect(window.location.search).toBe("?tag=a&tag=x&page=1");
    expect(screen.getByTestId("tag")).toHaveTextContent("a,x");

    await user.click(screen.getByTestId("append-tag"));
    expect(window.location.search).toBe("?tag=a&tag=x&tag=x&page=1");
    expect(screen.getByTestId("tag")).toHaveTextContent("a,x,x");
  });

  it("removes a key when it is set to undefined", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/test?tag=a&tag=b&page=1");

    render(
      <Router>
        <Wrapper />
      </Router>
    );

    await user.click(screen.getByTestId("remove-tag"));

    expect(window.location.search).toBe("?page=1");
    expect(screen.getByTestId("tag")).toHaveTextContent("undefined");
    expect(screen.getByTestId("page")).toHaveTextContent("1");
  });

  it("sets one key and removing another in one update", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/test?tag=a&tag=b&page=1");

    render(
      <Router>
        <Wrapper />
      </Router>
    );

    await user.click(screen.getByTestId("set-and-remove"));

    expect(window.location.search).toBe("?tag=z");
    expect(screen.getByTestId("tag")).toHaveTextContent("z");
    expect(screen.getByTestId("page")).toHaveTextContent("undefined");
  });

  it("updates on back/forward navigation", async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, "", "/test?page=1");

    render(
      <Router>
        <Wrapper />
      </Router>
    );

    // Push a new entry
    await user.click(screen.getByTestId("set-array"));
    expect(window.location.search).toBe("?tag=a&tag=b&page=2");

    // Back should restore prior URL + UI
    window.history.back();

    await waitFor(() => {
      expect(window.location.search).toBe("?page=1");
      expect(screen.getByTestId("tag")).toHaveTextContent("undefined");
      expect(screen.getByTestId("page")).toHaveTextContent("1");
    });

    // Forward should restore the next URL + UI
    window.history.forward();

    await waitFor(() => {
      expect(window.location.search).toBe("?tag=a&tag=b&page=2");
      expect(screen.getByTestId("tag")).toHaveTextContent("a,b");
      expect(screen.getByTestId("page")).toHaveTextContent("2");
    });
  });
});
