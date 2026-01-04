import "@testing-library/jest-dom";

Object.defineProperty(window, "scrollTo", {
  value: jest.fn(),
  writable: true,
});

class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();

  constructor(_callback: ResizeObserverCallback) {}
}

Object.defineProperty(window, "ResizeObserver", {
  value: MockResizeObserver,
  writable: true,
});

Object.defineProperty(globalThis, "ResizeObserver", {
  value: MockResizeObserver,
  writable: true,
});
