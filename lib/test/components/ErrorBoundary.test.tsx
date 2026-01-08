import { render, screen, waitFor } from "@testing-library/react";

import { Alert, Button, ErrorBoundary } from "../../src";

const Bomb = () => {
  throw new Error("💥 Boom!");
};

const Fallback = ({ error, reset }: { error: Error; reset: () => void }) => (
  <Alert type="error" data-testid="fallback">
    {error.message}
    <Button onClick={reset}>Reset</Button>
  </Alert>
);

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(<ErrorBoundary Fallback={Fallback}>Hello</ErrorBoundary>);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders fallback when child throws", async () => {
    render(
      <ErrorBoundary Fallback={Fallback}>
        <Bomb />
      </ErrorBoundary>
    );

    await waitFor(() => screen.getByTestId("fallback"));
    expect(screen.getByText("💥 Boom!")).toBeInTheDocument();
  });

  it("calls onError when error occurs", async () => {
    const onError = jest.fn();

    render(
      <ErrorBoundary Fallback={Fallback} onError={onError}>
        <Bomb />
      </ErrorBoundary>
    );

    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
  });
});
