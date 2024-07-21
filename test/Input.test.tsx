import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Input, TextArea, IconInput } from "../src";

describe("Input", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Type here..." />
    );
    expect(getByPlaceholderText("Type here...")).toBeInTheDocument;
  });
});

describe("TextArea", () => {
  it("renders correctly", () => {
    const { getByPlaceholderText } = render(
      <TextArea id="ta" placeholder="Type here..." />
    );
    expect(getByPlaceholderText("Type here...")).toBeInTheDocument;
  });
});

describe("IconInput", () => {
  it("renders correctly", () => {
    const { getByText } = render(
      <IconInput startIcon="🚀" inputProps={{ placeholder: "Type here..." }} />
    );
    expect(getByText("🚀")).toBeInTheDocument;
  });
});
