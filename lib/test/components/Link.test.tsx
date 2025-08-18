import React from "react";
import { render, screen } from "@testing-library/react";
import { Link, UnstyledLink, ButtonLink } from "../../src";

const CustomLinkElement = React.forwardRef<HTMLAnchorElement, any>(
  (props, ref) => {
    return <a {...props} className="cool" ref={ref} />;
  }
);

describe("Link", () => {
  it("renders a link", () => {
    render(
      <>
        <Link to="#" data-testid="regular">
          Regular
        </Link>
        <UnstyledLink to="#" data-testid="unstyled">
          Unstyled
        </UnstyledLink>
        <ButtonLink to="#" data-testid="button">
          Button
        </ButtonLink>
      </>
    );
    expect(screen.getByTestId("regular")).toBeInTheDocument();
    expect(screen.getByTestId("unstyled")).toBeInTheDocument();
    expect(screen.getByTestId("button")).toBeInTheDocument();
  });

  it("renders a link element with custom LinkElement", () => {
    render(
      <>
        <Link to="#" data-testid="regular" LinkElement={CustomLinkElement}>
          Regular
        </Link>
        <UnstyledLink
          to="#"
          data-testid="unstyled"
          LinkElement={CustomLinkElement}
        >
          Unstyled
        </UnstyledLink>
        <ButtonLink to="#" data-testid="button" LinkElement={CustomLinkElement}>
          Button
        </ButtonLink>
      </>
    );
    expect(screen.getByTestId("regular")).toHaveClass("cool");
    expect(screen.getByTestId("unstyled")).toHaveClass("cool");
    expect(screen.getByTestId("button")).toHaveClass("cool");
  });
});
