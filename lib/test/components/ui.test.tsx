import { render, screen } from "@testing-library/react";
import { ui } from "../../src";

const samples = ["div", "span", "strong", "h1", "h2"] as const;
describe("ui", () => {
  samples.forEach((sample) => {
    it(`renders ui.${sample}`, () => {
      const Component = ui[sample];
      render(<Component data-testid={sample} vfx={{ axis: "x" }} />);
      const element = screen.getByTestId(sample);
      expect(element).toBeInTheDocument();
      expect(element.className).toBe("aui-flex-x");
    });
  });
});
