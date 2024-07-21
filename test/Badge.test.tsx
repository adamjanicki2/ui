import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Badge } from "../src";

describe("Badge", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Badge type="info">Message</Badge>);
    expect(getByText("Message")).toBeInTheDocument;
  });
});
