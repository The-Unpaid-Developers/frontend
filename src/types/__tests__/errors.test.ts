import { describe, it, expect } from 'vitest';
import { APIError, ErrorType } from '../errors';

describe('APIError', () => {
  it('creates error with all properties', () => {
    const error = new APIError(ErrorType.SERVER_ERROR, 'Test error', 'Details', 500, true);
    expect(error.type).toBe(ErrorType.SERVER_ERROR);
    expect(error.message).toBe('Test error');
    expect(error.details).toBe('Details');
    expect(error.code).toBe(500);
    expect(error.retryable).toBe(true);
    expect(error.name).toBe('APIError');
  });

  it('creates error with minimal properties', () => {
    const error = new APIError(ErrorType.VALIDATION_ERROR, 'Validation failed');
    expect(error.type).toBe(ErrorType.VALIDATION_ERROR);
    expect(error.message).toBe('Validation failed');
    expect(error.retryable).toBe(false);
  });

  describe('fromResponse', () => {
    it('creates SERVER_ERROR for 500 status', () => {
      const response = { status: 500 } as Response;
      const error = APIError.fromResponse(response);
      expect(error.type).toBe(ErrorType.SERVER_ERROR);
      expect(error.code).toBe(500);
      expect(error.retryable).toBe(true);
    });

    it('creates SERVER_ERROR for 503 status', () => {
      const response = { status: 503 } as Response;
      const error = APIError.fromResponse(response, 'Service down');
      expect(error.type).toBe(ErrorType.SERVER_ERROR);
      expect(error.details).toBe('Service down');
      expect(error.retryable).toBe(true);
    });

    it('creates NOT_FOUND_ERROR for 404 status', () => {
      const response = { status: 404 } as Response;
      const error = APIError.fromResponse(response);
      expect(error.type).toBe(ErrorType.NOT_FOUND_ERROR);
      expect(error.code).toBe(404);
      expect(error.retryable).toBe(false);
    });

    it('creates PERMISSION_ERROR for 403 status', () => {
      const response = { status: 403 } as Response;
      const error = APIError.fromResponse(response);
      expect(error.type).toBe(ErrorType.PERMISSION_ERROR);
      expect(error.code).toBe(403);
      expect(error.retryable).toBe(false);
    });

    it('creates VALIDATION_ERROR for 400 status', () => {
      const response = { status: 400 } as Response;
      const error = APIError.fromResponse(response);
      expect(error.type).toBe(ErrorType.VALIDATION_ERROR);
      expect(error.code).toBe(400);
      expect(error.retryable).toBe(false);
    });

    it('creates VALIDATION_ERROR for 422 status', () => {
      const response = { status: 422 } as Response;
      const error = APIError.fromResponse(response, 'Invalid data');
      expect(error.type).toBe(ErrorType.VALIDATION_ERROR);
      expect(error.details).toBe('Invalid data');
    });

    it('creates UNKNOWN_ERROR for 2xx status', () => {
      const response = { status: 200 } as Response;
      const error = APIError.fromResponse(response);
      expect(error.type).toBe(ErrorType.UNKNOWN_ERROR);
      expect(error.retryable).toBe(true);
    });

    it('creates UNKNOWN_ERROR for 3xx status', () => {
      const response = { status: 302 } as Response;
      const error = APIError.fromResponse(response);
      expect(error.type).toBe(ErrorType.UNKNOWN_ERROR);
    });
  });

  describe('fromNetworkError', () => {
    it('creates NETWORK_ERROR from Error', () => {
      const networkError = new Error('Failed to fetch');
      const error = APIError.fromNetworkError(networkError);
      expect(error.type).toBe(ErrorType.NETWORK_ERROR);
      expect(error.details).toBe('Failed to fetch');
      expect(error.retryable).toBe(true);
      expect(error.code).toBeUndefined();
    });

    it('creates NETWORK_ERROR with connection message', () => {
      const networkError = new Error('Connection refused');
      const error = APIError.fromNetworkError(networkError);
      expect(error.message).toContain('Network connection failed');
    });
  });
});
