import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UnstyledLink } from "../src";

describe("Link", () => {
  it("renders correctly", () => {
    const { getByText } = render(<UnstyledLink to="/">Go here</UnstyledLink>);
    expect(getByText("Go here")).toBeInTheDocument;
  });
});
