import { render, screen } from "@testing-library/react";
import { Icon } from "../../src";
import { iconTypes } from "../../src/components/Icon/icons";

describe("Icon", () => {
  iconTypes.forEach((icon) => {
    it(`renders ${icon} icon`, () => {
      render(<Icon data-testid="icon" icon={icon} size={16} />);
      expect(screen.getByTestId("icon")).toBeInTheDocument();
    });
  });
});
