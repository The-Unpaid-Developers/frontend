/* eslint-disable react-refresh/only-export-components */
import React from "react";
import type { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "../context/ToastContext";

/**
 * Custom render function that wraps components with necessary providers
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ToastProvider>
        {children}
      </ToastProvider>
    </BrowserRouter>
  );
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

// Test utilities for common scenarios
export const renderWithoutRouter = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => {
  const TestProviders = ({ children }: { children: React.ReactNode }) => (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
  
  return render(ui, { wrapper: TestProviders, ...options });
};

export const renderWithRouter = customRender;

export * from "@testing-library/react";
export { customRender as render };
