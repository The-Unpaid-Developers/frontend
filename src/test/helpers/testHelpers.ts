import { vi, expect } from 'vitest';
import { waitFor } from '@testing-library/react';

/**
 * Common test helper functions to ensure consistency across tests
 */

// Standard error handling wrapper for async operations
export const expectAsyncError = async (
  asyncFn: () => Promise<any>,
  expectedError?: string | RegExp
) => {
  let thrownError: any;
  
  try {
    await asyncFn();
  } catch (error) {
    thrownError = error;
  }
  
  expect(thrownError).toBeDefined();
  if (expectedError) {
    // Handle different error formats
    let actualMessage = '';
    
    if (thrownError.response?.data?.message) {
      // HTTP error with response data
      actualMessage = thrownError.response.data.message;
    } else if (thrownError.message) {
      // Standard error with message
      actualMessage = thrownError.message;
    }
    
    if (typeof expectedError === 'string') {
      expect(actualMessage).toBe(expectedError);
    } else {
      expect(actualMessage).toMatch(expectedError);
    }
  }
  
  return thrownError;
};

// Standard async state waiting helper
export const waitForAsyncState = async (
  checkFn: () => boolean,
  timeout = 5000,
  interval = 100
) => {
  await waitFor(checkFn, { timeout, interval });
};

// Common mock function factory
export const createMockFunction = <T extends (...args: any[]) => any>(
  implementation?: T
) => {
  const mockFn = vi.fn();
  if (implementation) {
    mockFn.mockImplementation(implementation);
  }
  return mockFn as T & ReturnType<typeof vi.fn>;
};

// Standard API mock responses
export const createApiMockResponses = () => ({
  success: (data: any) => Promise.resolve(data),
  error: (message: string, status = 500) => 
    Promise.reject(new Error(message)),
  networkError: () => 
    Promise.reject(new TypeError('Failed to fetch')),
  timeout: () => 
    Promise.reject({ code: 'ECONNABORTED', message: 'timeout of 5000ms exceeded' }),
  malformed: () => 
    Promise.reject(new SyntaxError('Unexpected token in JSON')),
  unauthorized: () => 
    Promise.reject({ response: { status: 401, statusText: 'Unauthorized' } }),
  notFound: () => 
    Promise.reject({ response: { status: 404, statusText: 'Not Found' } }),
  serverError: () => 
    Promise.reject({ response: { status: 500, statusText: 'Internal Server Error' } })
});

// Standard hook mock factory
export const createHookMock = <T>(defaultReturnValue: T) => {
  const mockHook = vi.fn();
  mockHook.mockReturnValue(defaultReturnValue);
  return mockHook;
};

// Performance test helper with fake timers
export const createPerformanceTest = (
  testFn: () => void | Promise<void>,
  maxDuration = 1000
) => {
  return async () => {
    // Use fake timers to ensure consistent timing in CI
    vi.useFakeTimers();
    
    const startTime = Date.now();
    
    // Fast-forward any timers that might be used
    vi.advanceTimersByTime(0);
    
    await testFn();
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // Restore real timers
    vi.useRealTimers();
    
    // In fake timer environment, operations should be near-instantaneous
    expect(duration).toBeLessThan(maxDuration);
  };
};

// Common async operation test pattern
export const testAsyncOperation = async <T>(
  operation: () => Promise<T>,
  expectations: {
    shouldSucceed?: boolean;
    expectedResult?: T;
    expectedError?: string | RegExp;
    beforeOperation?: () => void;
    afterOperation?: (result?: T, error?: any) => void;
  }
) => {
  const { 
    shouldSucceed = true, 
    expectedResult, 
    expectedError,
    beforeOperation,
    afterOperation 
  } = expectations;
  
  if (beforeOperation) {
    beforeOperation();
  }
  
  if (shouldSucceed) {
    const result = await operation();
    if (expectedResult !== undefined) {
      expect(result).toEqual(expectedResult);
    }
    if (afterOperation) {
      afterOperation(result);
    }
    return result;
  } else {
    const error = await expectAsyncError(operation, expectedError);
    if (afterOperation) {
      afterOperation(undefined, error);
    }
    return error;
  }
};

// Standard loading state test helper
export const expectLoadingState = (
  loadingValue: boolean,
  expectedState: boolean,
  message?: string
) => {
  expect(loadingValue).toBe(expectedState);
  if (message) {
    console.log(`Loading state: ${expectedState} - ${message}`);
  }
};

// Common error state test helper
export const expectErrorState = (
  errorValue: string | null,
  expectedError: string | null,
  shouldBeNull = false
) => {
  if (shouldBeNull) {
    expect(errorValue).toBeNull();
  } else {
    expect(errorValue).toBe(expectedError);
  }
};

// HTTP status code test coverage helper
export const testAllHttpErrorCodes = (
  apiFunction: (...args: any[]) => Promise<any>,
  args: any[] = []
) => {
  const statusCodes = [400, 401, 403, 404, 408, 429, 500, 502, 503, 504];
  
  return statusCodes.map(status => ({
    status,
    test: () => {
      const errorMessage = `Request failed with status code ${status}`;
      return expectAsyncError(
        () => apiFunction(...args),
        new RegExp(errorMessage)
      );
    }
  }));
};