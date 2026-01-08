import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Alert, Layer } from "../../src";

type Props = {
  onClose: () => void;
};

const Wrapper = (props: Props) => (
  <Layer data-testid="layer" {...props}>
    <Alert data-testid="children" type="success">
      Success
    </Alert>
  </Layer>
);

describe("Layer", () => {
  it("renders", async () => {
    render(<Wrapper onClose={() => {}} />);
    expect(screen.getByTestId("children")).toBeInTheDocument();
  });

  it("fires onClose on escape", async () => {
    const callback = jest.fn();
    render(<Wrapper onClose={callback} />);
    await userEvent.keyboard("{Escape}");
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("fires onClose when clicked", async () => {
    const callback = jest.fn();
    render(<Wrapper onClose={callback} />);
    const layer = screen.getByTestId("layer");
    await userEvent.click(layer);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("doesn't fire onClose when children are clicked", async () => {
    const callback = jest.fn();
    render(<Wrapper onClose={callback} />);
    const children = screen.getByTestId("children");
    await userEvent.click(children);
    expect(callback).toHaveBeenCalledTimes(0);
  });
});
