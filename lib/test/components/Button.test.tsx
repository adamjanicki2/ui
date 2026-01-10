import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button, IconButton, UnstyledButton } from "../../src";
import { notAMoon } from "../../src/icons";

describe("Button", () => {
  it("renders buttons and fires onClick", async () => {
    const user = userEvent.setup();
    const callback = jest.fn();

    render(
      <>
        <Button onClick={callback}>Regular</Button>
        <UnstyledButton onClick={callback}>Unstyled</UnstyledButton>
        <IconButton icon={notAMoon} onClick={callback} />
      </>
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);

    buttons.forEach(async (button) => {
      await user.click(button);
      button.focus();
      await user.keyboard("{Enter}");
    });

    expect(callback).toHaveBeenCalledTimes(6);
  });
});
