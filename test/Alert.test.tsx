import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Alert } from "../src";

describe("Alert", () => {
  it("renders correctly", () => {
    const { getByText } = render(<Alert type="info">Message</Alert>);
    expect(getByText("Message")).toBeInTheDocument;
  });
});
