import { render, fireEvent } from "@testing-library/react";
import { Button, UnstyledButton } from "../../src";

describe("Button", () => {
  it("renders a button and fires onClick", async () => {
    const callback = jest.fn();
    const { container } = render(
      <>
        <Button onClick={callback}>Regular</Button>
        <UnstyledButton onClick={callback}>Unstyled</UnstyledButton>
      </>
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(2);

    buttons.forEach(fireEvent.click);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
