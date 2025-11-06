import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../../test/test-utils";
import { Button } from "../ui/Button";

describe("Button Component", () => {
  it("renders button with children", () => {
    render(<Button>Click me</Button>);
    expect(
      screen.getByRole("button", { name: "Click me" })
    ).toBeInTheDocument();
  });

  it("applies primary variant styles by default", () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary-600", "text-white");
  });

  it("applies secondary variant styles when specified", () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-gray-100", "text-gray-900");
  });

  it("applies danger variant styles when specified", () => {
    render(<Button variant="danger">Danger Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-red-600", "text-white");
  });

  it("applies ghost variant styles when specified", () => {
    render(<Button variant="ghost">Ghost Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-gray-700");
  });

  it("applies correct size classes", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-3", "py-1.5", "text-sm");

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-4", "py-2", "text-sm");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-6", "py-3", "text-base");
  });

  it("shows loading spinner when isLoading is true", () => {
    render(<Button isLoading>Loading Button</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
    // Check for loading spinner (SVG)
    expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();
  });

  it("is disabled when isLoading is true", () => {
    render(<Button isLoading>Loading Button</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("does not call onClick when loading", () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} isLoading>
        Loading Button
      </Button>
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom Button</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("forwards other props to the button element", () => {
    render(
      <Button data-testid="test-button" aria-label="Test">
        Button
      </Button>
    );
    const button = screen.getByTestId("test-button");
    expect(button).toHaveAttribute("aria-label", "Test");
  });
});
