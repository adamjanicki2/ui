import { render, screen } from "@testing-library/react";
import { Banner } from "../../src";

describe("Banner", () => {
  it("renders", () => {
    render(<Banner type="success">Success</Banner>);
    expect(screen.getByText("Success")).toBeInTheDocument();
  });
});
