import { render, screen } from "@testing-library/react";

import { Icon } from "../../src";
import { notAMoon } from "../../src/icons";

describe("Icon", () => {
  it("renders", () => {
    render(<Icon data-testid="icon" icon={notAMoon} size="s" />);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });
});
