import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import { ui } from "../../src";

describe("ui", () => {
  it("renders correct tag", () => {
    render(<ui.div data-testid="div" />);
    expect(screen.getByTestId("div").tagName).toBe("DIV");
  });

  it("passes standard props", () => {
    const onClick = jest.fn();
    render(
      <ui.button type="button" onClick={onClick}>
        Click
      </ui.button>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("forwards refs correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ui.div data-testid="div" ref={ref} />);
    expect(ref.current).toBe(screen.getByTestId("div"));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges className with vfx classNames", () => {
    render(
      <ui.div
        data-testid="div"
        className=" red green  "
        vfx={{ padding: "s", border: true }}
      />
    );
    expect(screen.getByTestId("div").className).toBe(
      "red green aui-pa-s aui-ba"
    );
  });

  it("handles more complex refs", () => {
    const buttonRef = React.createRef<HTMLButtonElement>();
    const inputRef = jest.fn<void, [HTMLInputElement | null]>();

    render(
      <>
        <ui.button ref={buttonRef} type="button">
          Ok
        </ui.button>
        <ui.input ref={inputRef} data-testid="input" />
      </>
    );

    expect(buttonRef.current).toBe(screen.getByRole("button"));
    expect(buttonRef.current).toBeInstanceOf(HTMLButtonElement);

    const input = screen.getByTestId("input");
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(inputRef).toHaveBeenCalledWith(input);
  });

  it("caches correctly", () => {
    expect(ui.div).toBe(ui.div);
    expect(ui.div).not.toBe(ui.span);
  });
});
