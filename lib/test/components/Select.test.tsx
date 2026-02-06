import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Select from "../../src/components/Select";

describe("Select", () => {
  it("renders and calls onSelect", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();

    const options = ["apple", "orange"] as const;

    render(<Select options={options} onSelect={onSelect} />);

    await user.selectOptions(screen.getByRole("combobox"), "orange");

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("orange");
  });
});
