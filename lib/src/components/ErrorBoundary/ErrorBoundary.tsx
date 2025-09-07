import React from "react";

type FallbackProps = { error: Error; reset: () => void };

type Props = {
  /**
   * Component to render when an error is caught
   */
  Fallback: React.ComponentType<FallbackProps>;
  /**
   * Children wrapped by the error boundary
   */
  children: React.ReactNode;
  /**
   * Called when an error is caught
   */
  onError?: (error: Error, info: React.ErrorInfo) => void;
  /**
   * Called when the error state is reset
   */
  onReset?: () => void;
  /**
   * Dependencies to trigger a reset on change
   */
  deps?: unknown[];
};

type State = {
  error: Error | null;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info);
  }

  componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.depsUpdated(this.props.deps, prevProps.deps)) {
      this.resetErrorBoundary();
    }
  }

  private resetErrorBoundary = () => {
    if (this.state.error !== null) {
      this.setState({ error: null });
      this.props.onReset?.();
    }
  };

  private depsUpdated(nextDeps?: unknown[], prevDeps?: unknown[]) {
    if (!nextDeps || !prevDeps) return false;
    if (nextDeps.length !== prevDeps.length) return true;
    return nextDeps.some((dep, i) => !Object.is(dep, prevDeps[i]));
  }

  render(): React.ReactNode {
    const { Fallback, children } = this.props;
    const { error } = this.state;

    if (!error) {
      return children;
    }

    return <Fallback error={error} reset={this.resetErrorBoundary} />;
  }
}
