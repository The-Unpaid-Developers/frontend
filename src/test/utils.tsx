/* eslint-disable react-refresh/only-export-components */
import React from "react";
import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { SolutionReviewProvider } from "../context/SolutionReviewContext";

/**
 * Custom render function that wraps components with necessary providers
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <SolutionReviewProvider>{children}</SolutionReviewProvider>;
};

/**
 * Custom render method that includes providers by default
 * @param ui - The component to render
 * @param options - Additional render options
 * @returns Render result with providers
 */
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from "@testing-library/react";
export { customRender as render };
