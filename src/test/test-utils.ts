import { vi, beforeEach, afterEach, expect } from 'vitest';
import type { MockedFunction } from 'vitest';

/**
 * Creates a mock implementation for console methods
 */
export const mockConsole = () => {
  const originalConsole = { ...console };
  
  beforeEach(() => {
    console.log = vi.fn();
    console.warn = vi.fn();
    console.error = vi.fn();
    console.info = vi.fn();
  });
  
  afterEach(() => {
    Object.assign(console, originalConsole);
  });
  
  return {
    log: console.log as MockedFunction<typeof console.log>,
    warn: console.warn as MockedFunction<typeof console.warn>,
    error: console.error as MockedFunction<typeof console.error>,
    info: console.info as MockedFunction<typeof console.info>,
  };
};

/**
 * Mock localStorage for testing
 */
export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
  
  return localStorageMock;
};

/**
 * Mock sessionStorage for testing
 */
export const mockSessionStorage = () => {
  const sessionStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  
  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
    writable: true,
  });
  
  return sessionStorageMock;
};

/**
 * Mock window.location for testing
 */
export const mockLocation = (url = 'http://localhost:3000/') => {
  const locationMock = new URL(url);
  Object.defineProperty(window, 'location', {
    value: locationMock,
    writable: true,
  });
  return locationMock;
};

/**
 * Mock window.matchMedia for testing responsive designs
 */
export const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

/**
 * Wait for next tick (useful for async operations)
 */
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * Create mock file for file upload testing
 */
export const createMockFile = (name = 'test.txt', content = 'test content', type = 'text/plain') => {
  return new File([content], name, { type });
};

/**
 * Mock axios for API testing (if you're using axios)
 */
export const mockAxios = () => {
  return {
    get: vi.fn(() => Promise.resolve({ data: {} })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
    patch: vi.fn(() => Promise.resolve({ data: {} })),
    request: vi.fn(() => Promise.resolve({ data: {} })),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  };
};

/**
 * Helper to test error boundaries
 */
export const throwError = () => {
  throw new Error('Test error');
};

/**
 * Mock intersection observer entries
 */
export const mockIntersectionObserverEntry = (isIntersecting = true): IntersectionObserverEntry => ({
  boundingClientRect: {} as DOMRectReadOnly,
  intersectionRatio: isIntersecting ? 1 : 0,
  intersectionRect: {} as DOMRectReadOnly,
  isIntersecting,
  rootBounds: {} as DOMRectReadOnly,
  target: {} as Element,
  time: Date.now(),
});

/**
 * Type-safe matcher for testing objects
 */
export const expectObjectMatching = <T>(expected: Partial<T>) => 
  expect.objectContaining(expected as any);

/**
 * Helper for testing async hooks
 */
export const flushPromises = () => new Promise(setImmediate);