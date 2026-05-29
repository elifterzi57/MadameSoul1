import { describe, it, expect } from 'vitest';
import { formatDate, isValidDob } from '../../src/lib/helpers';

describe('formatDate', () => {
  it('should return empty string if dateStr is empty', () => {
    expect(formatDate('')).toBe('');
  });

  it('should return original string if dateStr is invalid', () => {
    expect(formatDate('invalid-date')).toBe('invalid-date');
  });

  it('should format date string to US format by default', () => {
    const formatted = formatDate('1995-05-15', 'en');
    // Note: US formatted dates might have different spaces depending on environment,
    // so we test content inclusion.
    expect(formatted).toContain('May');
    expect(formatted).toContain('15');
    expect(formatted).toContain('1995');
  });

  it('should format date string to TR format if specified', () => {
    const formatted = formatDate('1995-05-15', 'tr');
    expect(formatted).toContain('Mayıs');
    expect(formatted).toContain('15');
    expect(formatted).toContain('1995');
  });
});

describe('isValidDob', () => {
  it('should return false for empty or null string', () => {
    expect(isValidDob('')).toBe(false);
  });

  it('should return false for invalid formats', () => {
    expect(isValidDob('15-05-1995')).toBe(false);
    expect(isValidDob('1995/05/15')).toBe(false);
    expect(isValidDob('95-05-15')).toBe(false);
  });

  it('should return false for future dates', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureStr = futureDate.toISOString().split('T')[0];
    expect(isValidDob(futureStr)).toBe(false);
  });

  it('should return false for non-existent calendar dates', () => {
    expect(isValidDob('2021-02-31')).toBe(false); // February 31st
    expect(isValidDob('2021-04-31')).toBe(false); // April 31st
  });

  it('should return true for valid past date in YYYY-MM-DD format', () => {
    expect(isValidDob('1995-05-15')).toBe(true);
    expect(isValidDob('2000-02-29')).toBe(true); // Leap year
  });
});
