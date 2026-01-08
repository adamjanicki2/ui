import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import Autocomplete from "../../src/components/Autocomplete";

describe("Autocomplete", () => {
  it("opens on focus without a click", async () => {
    const user = userEvent.setup();

    const Controlled = () => {
      const [value, setValue] = React.useState("");
      return (
        <Autocomplete
          value={value}
          onInputChange={(e) => setValue(e.target.value)}
          onSelect={() => {}}
          options={["Apple", "Banana"]}
          popoverProps={{ duration: 0 }}
        />
      );
    };

    render(<Controlled />);

    await user.tab();
    expect(screen.getByText("Apple")).toBeInTheDocument();
  });

  it("opens on click and selects an option", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();

    const Controlled = () => {
      const [value, setValue] = React.useState("");
      return (
        <Autocomplete
          value={value}
          onInputChange={(e) => setValue(e.target.value)}
          onSelect={onSelect}
          options={["Apple", "Banana"]}
          popoverProps={{ duration: 0 }}
        />
      );
    };

    render(<Controlled />);

    await user.click(screen.getByRole("textbox"));
    await user.click(screen.getByText("Apple"));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith("Apple");
    expect(screen.queryByText("Banana")).not.toBeInTheDocument();
  });

  it("fires onUnselectedEnter when nothing highlighted", async () => {
    const user = userEvent.setup();
    const onUnselectedEnter = jest.fn();

    const Controlled = () => {
      const [value, setValue] = React.useState("");
      return (
        <Autocomplete
          value={value}
          onInputChange={(e) => setValue(e.target.value)}
          onSelect={() => {}}
          options={["Apple"]}
          onUnselectedEnter={onUnselectedEnter}
          popoverProps={{ duration: 0 }}
        />
      );
    };

    render(<Controlled />);

    await user.click(screen.getByRole("textbox"));
    await user.keyboard("{Enter}");

    expect(onUnselectedEnter).toHaveBeenCalledTimes(1);
  });

  it("supports customize for non-string option types", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();

    type Option = { label: string };

    const Controlled = () => {
      const [value, setValue] = React.useState("");
      return (
        <Autocomplete
          value={value}
          onInputChange={(e) => setValue(e.target.value)}
          onSelect={onSelect}
          options={[] as const}
          customize={(query): Option => ({ label: query })}
          popoverProps={{ duration: 0 }}
        />
      );
    };

    render(<Controlled />);

    await user.click(screen.getByRole("textbox"));
    await user.type(screen.getByRole("textbox"), "Dragonfruit");
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith({ label: "Dragonfruit" });
  });
});
