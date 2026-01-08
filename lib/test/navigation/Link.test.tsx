import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import { ButtonLink, Link, Router, UnstyledLink } from "../../src";

describe("Link", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/");
  });

  describe("without Router", () => {
    it("renders", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <Link data-testid="main" to="/about">
            About
          </Link>
          <UnstyledLink to="/about">About</UnstyledLink>
          <ButtonLink to="/about">About</ButtonLink>
        </div>
      );

      const link = screen.getByTestId("main");
      expect(link).toHaveAttribute("href", "/about");

      // just tests that no assertions thrown
      await user.click(link);
    });

    it("sets target and rel for newTab", () => {
      render(
        <Link to="/about" newTab>
          About
        </Link>
      );

      const link = screen.getByRole("link", { name: "About" });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer noopener");
    });
  });

  describe("with Router context", () => {
    it("prevents default for internal nav", async () => {
      const user = userEvent.setup();

      render(
        <Router basename="/app">
          <Link to="/a">Go</Link>
        </Router>
      );

      const link = screen.getByRole("link", { name: "Go" });
      await user.click(link);

      expect(window.location.pathname).toBe("/app/a");
    });

    it("does not prevent default for special keys", async () => {
      render(
        <Router basename="/app">
          <Link to="/a">Go</Link>
        </Router>
      );

      const link = screen.getByRole("link", { name: "Go" });

      fireEvent.click(link, { metaKey: true, button: 0 });

      expect(window.location.pathname).toBe("/");
    });

    it("does not prevent default if newTab is true", async () => {
      const user = userEvent.setup();

      render(
        <Router basename="/app">
          <Link to="/a" newTab>
            Go
          </Link>
        </Router>
      );

      const link = screen.getByRole("link", { name: "Go" });
      await user.click(link);

      expect(window.location.pathname).toBe("/");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer noopener");
    });

    it("does not prevent default for external URLs", async () => {
      const user = userEvent.setup();

      render(
        <Router basename="/app">
          <Link to="https://example.com">External</Link>
        </Router>
      );

      const link = screen.getByRole("link", { name: "External" });
      expect(link).toHaveAttribute("href", "https://example.com");
      await user.click(link);
      expect(window.location.pathname).toBe("/");
    });

    it("onClick prop and respects downstream preventDefault", async () => {
      const user = userEvent.setup();
      const onClick = jest.fn((event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
      });

      render(
        <Router basename="/app">
          <Link to="/a" onClick={onClick}>
            Go
          </Link>
        </Router>
      );

      const link = screen.getByRole("link", { name: "Go" });
      await user.click(link);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(window.location.pathname).toBe("/");
    });

    it("supports keyboard activation", async () => {
      const user = userEvent.setup();

      render(
        <Router basename="/app/slug">
          <Link to="a">Go</Link>
        </Router>
      );

      const link = screen.getByRole("link", { name: "Go" });
      link.focus();
      expect(link).toHaveFocus();
      await user.keyboard("{Enter}");
      expect(window.location.pathname).toBe("/app/slug/a");
    });
  });
});
