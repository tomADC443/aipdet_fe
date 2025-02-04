import { describe, it, expect } from 'vitest';
import { calculateDateDifference } from './utils'; // Adjust the import path

describe('calculateDateDifference', () => {
    it('should calculate difference between two dates in same year', () => {
        const result = calculateDateDifference('2024-01-01', '2024-06-15');
        expect(result).toEqual({
            years: 0,
            months: 5,
            days: 14
        });
    });

    it('should calculate difference spanning multiple years', () => {
        const result = calculateDateDifference('2022-03-15', '2024-05-10');
        expect(result).toEqual({
            years: 2,
            months: 1,
            days: 25
        });
    });

    it('should handle month rollover correctly', () => {
        const result = calculateDateDifference('2024-01-31', '2024-03-15');
        expect(result).toEqual({
            years: 0,
            months: 1,
            days: 13
        });
    });

    it('should handle year rollover correctly', () => {
        const result = calculateDateDifference('2023-12-15', '2024-02-10');
        expect(result).toEqual({
            years: 0,
            months: 1,
            days: 26
        });
    });

    it('should handle same dates', () => {
        const result = calculateDateDifference('2024-01-01', '2024-01-01');
        expect(result).toEqual({
            years: 0,
            months: 0,
            days: 0
        });
    });

    it('should throw error for invalid date format', () => {
        expect(() => calculateDateDifference('invalid-date', '2024-01-01'))
            .toThrow("Invalid date format. Use 'YYYY-MM-DD'.");

        expect(() => calculateDateDifference('2024-01-01', 'another-invalid'))
            .toThrow("Invalid date format. Use 'YYYY-MM-DD'.");
    });

    it('should handle leap year dates correctly', () => {
        const result = calculateDateDifference('2024-02-01', '2024-03-01');
        expect(result).toEqual({
            years: 0,
            months: 1,
            days: 0
        });
    });

    it('should handle dates across multiple leap years', () => {
        const result = calculateDateDifference('2020-02-29', '2024-03-01');
        expect(result).toEqual({
            years: 4,
            months: 0,
            days: 1
        });
    });
});