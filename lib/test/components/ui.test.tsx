import { render, screen } from "@testing-library/react";
import { ui } from "../../src";

describe("ui", () => {
  Object.entries(ui).forEach(([name, Component]) => {
    it(`renders ui.${name}`, () => {
      render(<Component data-testid={name} layout={{ axis: "x" }} />);
      const element = screen.getByTestId(name);
      expect(element).toBeInTheDocument();
      expect(element.className).toBe("aui-flex-x");
    });
  });
});
