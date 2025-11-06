import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockApiService } from '../mockApiUpdated';
import { ErrorType } from '../../types/errors';

describe('mockApiService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('getSolutionReviewById', () => {
    it('returns review when found', async () => {
      const review = await mockApiService.getSolutionReviewById('1');
      expect(review).not.toBeNull();
      expect(review?.id).toBe('1');
      expect(review?.systemCode).toBe('sys-001');
    });

    it('returns null when not found', async () => {
      const review = await mockApiService.getSolutionReviewById('999');
      expect(review).toBeNull();
    });

    it('throws validation error for empty id', async () => {
      await expect(mockApiService.getSolutionReviewById('')).rejects.toMatchObject({
        type: ErrorType.VALIDATION_ERROR,
        code: 400,
        retryable: false,
      });
    });

    it('throws validation error for invalid type', async () => {
      await expect(mockApiService.getSolutionReviewById(null as any)).rejects.toMatchObject({
        type: ErrorType.VALIDATION_ERROR,
      });
    });
  });

  describe('getAllSolutionReviews', () => {
    it('returns all reviews', async () => {
      const reviews = await mockApiService.getAllSolutionReviews();
      expect(reviews.length).toBe(5);
      expect(reviews[0].id).toBe('1');
      expect(reviews[4].id).toBe('5');
    });

    it('returns copy of array', async () => {
      const reviews1 = await mockApiService.getAllSolutionReviews();
      const reviews2 = await mockApiService.getAllSolutionReviews();
      expect(reviews1).not.toBe(reviews2);
    });
  });

  describe('getSystemSolutionReviews', () => {
    it('returns reviews for specific system', async () => {
      const reviews = await mockApiService.getSystemSolutionReviews('sys-001');
      expect(reviews.length).toBe(1);
      expect(reviews[0].systemCode).toBe('sys-001');
    });

    it('returns empty array for non-existent system', async () => {
      const reviews = await mockApiService.getSystemSolutionReviews('sys-999');
      expect(reviews.length).toBe(0);
    });

    it('returns multiple reviews for same system', async () => {
      const reviews = await mockApiService.getSystemSolutionReviews('sys-002');
      expect(reviews.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('login', () => {
    it('stores token in localStorage', async () => {
      const result = await mockApiService.login('testuser', 'admin');
      expect(localStorage.getItem('userToken')).toBe('admin');
      expect(result.token).toBe('admin');
    });

    it('stores username in localStorage', async () => {
      await mockApiService.login('johndoe', 'user');
      expect(localStorage.getItem('username')).toBe('johndoe');
    });

    it('returns token in response', async () => {
      const result = await mockApiService.login('alice', 'editor');
      expect(result).toEqual({ token: 'editor' });
    });
  });
});
