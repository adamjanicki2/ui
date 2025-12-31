import { render, screen } from "@testing-library/react";
import { Icon } from "../../src";
import * as icons from "../../src/icons";

describe("Icon", () => {
  Object.entries(icons).forEach(([name, icon]) => {
    it(`renders ${name} icon`, () => {
      render(<Icon data-testid="icon" icon={icon} size="s" />);
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });
  });
});
