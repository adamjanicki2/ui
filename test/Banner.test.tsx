import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Banner } from "../src";

describe("Banner", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Banner type="info">Message</Banner>);
    expect(getByText("Message")).toBeInTheDocument;
  });
});
