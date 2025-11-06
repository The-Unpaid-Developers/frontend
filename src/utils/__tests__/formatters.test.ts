import { describe, it, expect } from 'vitest';
import { formatBoolean, formatDate, displayValue } from '../formatters';

describe('formatters', () => {
  describe('formatBoolean', () => {
    it('returns "Yes" for boolean true', () => {
      expect(formatBoolean(true)).toBe('Yes');
    });

    it('returns "Yes" for string "TRUE"', () => {
      expect(formatBoolean('TRUE')).toBe('Yes');
    });

    it('returns "Yes" for string "true"', () => {
      expect(formatBoolean('true')).toBe('Yes');
    });

    it('returns "No" for boolean false', () => {
      expect(formatBoolean(false)).toBe('No');
    });

    it('returns "No" for string "FALSE"', () => {
      expect(formatBoolean('FALSE')).toBe('No');
    });

    it('returns "No" for string "false"', () => {
      expect(formatBoolean('false')).toBe('No');
    });

    it('returns "—" for null', () => {
      expect(formatBoolean(null)).toBe('—');
    });

    it('returns "—" for undefined', () => {
      expect(formatBoolean(undefined)).toBe('—');
    });

    it('returns string representation for other values', () => {
      expect(formatBoolean('maybe')).toBe('maybe');
      expect(formatBoolean(123)).toBe('123');
      expect(formatBoolean(0)).toBe('0');
      expect(formatBoolean('')).toBe('');
    });

    it('handles objects with toString method', () => {
      const obj = { toString: () => 'custom string' };
      expect(formatBoolean(obj)).toBe('custom string');
    });

    it('handles arrays', () => {
      expect(formatBoolean([1, 2, 3])).toBe('1,2,3');
    });
  });

  describe('formatDate', () => {
    it('formats valid date string correctly', () => {
      const dateString = '2023-12-25T10:30:00Z';
      const result = formatDate(dateString);

      // The exact format depends on locale, but should contain the date components
      expect(result).toMatch(/December/);
      expect(result).toMatch(/25/);
      expect(result).toMatch(/2023/);
      // Time will be converted to local timezone, so just check for time format (HH:MM)
      expect(result).toMatch(/\d{1,2}:\d{2}/);
    });

    it('formats ISO date string correctly', () => {
      const dateString = '2023-01-01T00:00:00.000Z';
      const result = formatDate(dateString);
      
      expect(result).toMatch(/January/);
      expect(result).toMatch(/1/);
      expect(result).toMatch(/2023/);
    });

    it('handles date string without time', () => {
      const dateString = '2023-06-15';
      const result = formatDate(dateString);
      
      expect(result).toMatch(/June/);
      expect(result).toMatch(/15/);
      expect(result).toMatch(/2023/);
    });

    it('formats different months correctly', () => {
      const march = formatDate('2023-03-15T12:00:00Z');
      const september = formatDate('2023-09-15T12:00:00Z');
      
      expect(march).toMatch(/March/);
      expect(september).toMatch(/September/);
    });

    it('includes AM/PM format for time', () => {
      const morning = formatDate('2023-12-25T09:30:00Z');
      const evening = formatDate('2023-12-25T21:30:00Z');
      
      expect(morning).toMatch(/AM|PM/);
      expect(evening).toMatch(/AM|PM/);
    });

    // Note: Invalid dates will be handled by the Date constructor
    // which may produce "Invalid Date" or similar
    it('handles invalid date strings', () => {
      const result = formatDate('invalid-date');
      expect(result).toMatch(/Invalid Date|NaN/);
    });
  });

  describe('displayValue', () => {
    it('returns string representation of values', () => {
      expect(displayValue('hello')).toBe('hello');
      expect(displayValue(123)).toBe('123');
      expect(displayValue(true)).toBe('true');
      expect(displayValue(false)).toBe('false');
    });

    it('returns "—" for null', () => {
      expect(displayValue(null)).toBe('—');
    });

    it('returns "—" for undefined', () => {
      expect(displayValue(undefined)).toBe('—');
    });

    it('handles empty string', () => {
      expect(displayValue('')).toBe('');
    });

    it('handles zero', () => {
      expect(displayValue(0)).toBe('0');
    });

    it('handles objects with toString method', () => {
      const obj = { toString: () => 'object string' };
      expect(displayValue(obj)).toBe('object string');
    });

    it('handles arrays', () => {
      expect(displayValue([1, 2, 3])).toBe('1,2,3');
      expect(displayValue([])).toBe('');
    });

    it('handles numbers correctly', () => {
      expect(displayValue(0)).toBe('0');
      expect(displayValue(-1)).toBe('-1');
      expect(displayValue(3.14)).toBe('3.14');
      expect(displayValue(Infinity)).toBe('Infinity');
      expect(displayValue(NaN)).toBe('NaN');
    });
  });
});