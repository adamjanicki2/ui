import { render, screen } from "@testing-library/react";
import React from "react";

import { Alert, Badge, Banner } from "../../src/components/Signal";

describe("Signal", () => {
  it("renders Alert and forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Alert type="success" ref={ref}>
        Alert
      </Alert>
    );

    expect(screen.getByText("Alert")).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders Badge and forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Badge type="info" ref={ref}>
        Badge
      </Badge>
    );

    expect(screen.getByText("Badge")).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders Banner and forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Banner type="warning" ref={ref}>
        Banner
      </Banner>
    );

    expect(screen.getByText("Banner")).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
