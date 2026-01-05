import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Autocomplete from "../../src/components/Autocomplete";

describe("Autocomplete", () => {
  it("opens on focus without a click", async () => {
    const user = userEvent.setup();

    const Controlled = () => {
      const [value, setValue] = React.useState<string | null>(null);
      const [query, setQuery] = React.useState("");
      return (
        <Autocomplete
          options={["Apple", "Banana"]}
          value={value}
          onChange={(next) => setValue(next)}
          query={query}
          setQuery={setQuery}
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
    const onChange = jest.fn();

    const Controlled = () => {
      const [value, setValue] = React.useState<string | null>(null);
      const [query, setQuery] = React.useState("");
      return (
        <Autocomplete
          options={["Apple", "Banana"]}
          value={value}
          onChange={(next) => {
            onChange(next);
            setValue(next);
          }}
          query={query}
          setQuery={setQuery}
          popoverProps={{ duration: 0 }}
        />
      );
    };

    render(<Controlled />);

    await user.click(screen.getByRole("textbox"));
    await user.click(screen.getByText("Apple"));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("Apple");
    expect(screen.queryByText("Banana")).not.toBeInTheDocument();
  });

  it("fires onCustomSelect on Enter when customized", async () => {
    const user = userEvent.setup();
    const onCustomSelect = jest.fn();

    const Controlled = () => {
      const [value, setValue] = React.useState<string | null>(null);
      const [query, setQuery] = React.useState("");
      return (
        <Autocomplete
          options={["Apple"]}
          customize
          value={value}
          onChange={(next) => setValue(next)}
          onCustomSelect={onCustomSelect}
          query={query}
          setQuery={setQuery}
          popoverProps={{ duration: 0 }}
        />
      );
    };

    render(<Controlled />);

    await user.click(screen.getByRole("textbox"));
    await user.type(screen.getByRole("textbox"), "Dragonfruit");
    await user.keyboard("{Enter}");

    expect(onCustomSelect).toHaveBeenCalledTimes(1);
    expect(onCustomSelect).toHaveBeenCalledWith("Dragonfruit", {
      reason: "enter",
    });
  });
});
