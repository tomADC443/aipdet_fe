import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    formatUnixTimestampToLocalTime,
    authenticatedBackendFetch,
    getErrorCodeText
} from './utils';

// Mock the import.meta.env
vi.mock('import.meta', () => ({
    env: {
        VITE_BASE_URL_API: 'http://localhost:8000' // dev only 
    }
}));

describe('formatUnixTimestampToLocalTime', () => {
    it('should format unix timestamp to local time string', () => {
        // Using a fixed timestamp for consistent testing
        const timestamp = 1738689533;
        const result = formatUnixTimestampToLocalTime(timestamp);
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
        expect(result).toBe('2/4/2025, 6:18:53 PM');
    });

    it('should handle zero timestamp', () => {
        const result = formatUnixTimestampToLocalTime(0);
        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
    });
});


describe('authenticatedBackendFetch', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        global.fetch = vi.fn();
    });

    it('should make successful API call', async () => {
        const mockResponse = { id: 1, name: 'Test' };
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        });

        const result = await authenticatedBackendFetch<typeof mockResponse>(
            'test-endpoint',
            'GET'
        );

        expect(result).toEqual({
            status: 'success',
            data: mockResponse
        });

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8000/api/test-endpoint',
            {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Connection': 'keep-alive'
                }
            }
        );
    });

    it('should merge custom options with defaults', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({})
        });

        const customOptions = {
            headers: {
                'Authorization': 'Bearer token'
            },
            body: JSON.stringify({ test: true })
        };

        await authenticatedBackendFetch('test-endpoint', 'POST', customOptions);

        const expectedOptions = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Connection': 'keep-alive',
                'Authorization': 'Bearer token'
            },
            body: JSON.stringify({ test: true })
        };

        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:8000/api/test-endpoint',
            expectedOptions
        );
    });

    it('should handle non-OK response', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 404
        });

        const result = await authenticatedBackendFetch('test-endpoint', 'GET');

        expect(result).toEqual({
            status: 'error',
            data: null,
            errorCode: 404
        });
    });

    it('should handle network error', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        const result = await authenticatedBackendFetch('test-endpoint', 'GET');

        expect(result).toEqual({
            status: 'error',
            data: null
        });
    });


});

describe('getErrorCodeText', () => {
    it('should return correct message for 400', () => {
        expect(getErrorCodeText(400)).toBe('Bad Request. Please try again later.');
    });

    it('should return correct message for 401', () => {
        expect(getErrorCodeText(401)).toBe('You are not authorized to request this data.');
    });

    it('should return correct message for 403', () => {
        expect(getErrorCodeText(403)).toBe('You are not authorized to request this data.');
    });

    it('should return correct message for 404', () => {
        expect(getErrorCodeText(404)).toBe('Task could not be found. Please try again later.');
    });

    it('should return default message for undefined error code', () => {
        expect(getErrorCodeText(undefined)).toBe('Failed to fetch data. Please try again later.');
    });

    it('should return default message for unknown error code', () => {
        expect(getErrorCodeText(500)).toBe('Failed to fetch data. Please try again later.');
    });
});