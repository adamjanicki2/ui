import { render, screen } from "@testing-library/react";

import { Badge } from "../../src";

describe("Badge", () => {
  it("renders", () => {
    render(<Badge type="success">Success</Badge>);
    expect(screen.getByText("Success")).toBeInTheDocument();
  });
});
