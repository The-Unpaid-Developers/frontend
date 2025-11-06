import React from "react";
import type { ReactElement, ReactNode } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "../context/ToastContext";
import { vi } from 'vitest';

// Import and re-export everything explicitly
import {
  screen,
  fireEvent,
  waitFor,
  cleanup,
  act,
  within,
  getByText,
  getByRole,
  getByLabelText,
  queryByText,
  queryByRole,
  findByText,
  findByRole,
} from "@testing-library/react";

export {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
  act,
  within,
  getByText,
  getByRole,
  getByLabelText,
  queryByText,
  queryByRole,
  findByText,
  findByRole,
};

export { userEvent } from '@testing-library/user-event';

/**
 * Custom render function that wraps components with necessary providers
 */
const AllTheProviders = ({ children }: { children: ReactNode }) => {
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
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export const renderWithRouter = renderWithProviders;

/**
 * Test data factories
 */
export const createMockUser = (overrides = {}) => ({
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  role: 'user',
  ...overrides,
});

export const createMockQuery = (overrides = {}) => ({
  id: '1',
  title: 'Test Query',
  description: 'Test query description',
  sql: 'SELECT * FROM test',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  ...overrides,
});

export const createMockSolutionReview = (overrides = {}) => ({
  id: '1',
  title: 'Test Solution Review',
  description: 'Test description',
  status: 'draft',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  ...overrides,
});

/**
 * Mock console functions for testing
 */
export const mockConsole = () => {
  const originalConsole = console;
  const mockedConsole = {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  };

  // Mock all console methods
  vi.spyOn(console, 'log').mockImplementation(mockedConsole.log);
  vi.spyOn(console, 'error').mockImplementation(mockedConsole.error);
  vi.spyOn(console, 'warn').mockImplementation(mockedConsole.warn);
  vi.spyOn(console, 'info').mockImplementation(mockedConsole.info);
  vi.spyOn(console, 'debug').mockImplementation(mockedConsole.debug);

  return {
    ...mockedConsole,
    restore: () => {
      console.log = originalConsole.log;
      console.error = originalConsole.error;
      console.warn = originalConsole.warn;
      console.info = originalConsole.info;
      console.debug = originalConsole.debug;
    },
  };
};