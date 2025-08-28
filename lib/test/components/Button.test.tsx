import { render, fireEvent } from "@testing-library/react";
import { Button, UnstyledButton, IconButton } from "../../src";

describe("Button", () => {
  it("renders a button and fires onClick", async () => {
    const callback = jest.fn();
    const { container } = render(
      <>
        <Button onClick={callback}>Regular</Button>
        <UnstyledButton onClick={callback}>Unstyled</UnstyledButton>
        <IconButton icon="not-a-moon" onClick={callback} />
      </>
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(3);

    buttons.forEach(fireEvent.click);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});
