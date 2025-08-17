import React from "react";
import { render, screen } from "@testing-library/react";
import { Alert } from "../../src";

describe("Alert", () => {
  it("renders", () => {
    render(<Alert type="success">Success</Alert>);
    expect(screen.getByText("Success")).toBeInTheDocument();
  });
});
