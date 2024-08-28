import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button, IconButton } from "../src";

describe("Button", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Button>Click me</Button>);
    expect(getByText("Click me")).toBeInTheDocument;
  });
});

describe("IconButton", () => {
  it("renders correctly", () => {
    const { getByRole } = render(<IconButton icon="🚀" aria-label="rocket" />);
    expect(getByRole("button")).toBeInTheDocument;
  });
});
