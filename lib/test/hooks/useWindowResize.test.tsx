import { render } from "@testing-library/react";

import { useWindowResize } from "../../src";

const mockWindowResize = () => {
  window.innerWidth *= 2;
  window.innerHeight *= 2;
  window.dispatchEvent(new Event("resize"));
};

const Wrapper = ({ callback }: { callback: (event?: UIEvent) => void }) => {
  useWindowResize(callback);
  return <div />;
};

describe("useWindowResize", () => {
  it("fires when window resizes", () => {
    const callback = jest.fn();
    render(<Wrapper callback={callback} />);
    mockWindowResize();
    mockWindowResize();
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
