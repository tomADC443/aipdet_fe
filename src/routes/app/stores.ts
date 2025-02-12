import { derived } from 'svelte/store';
import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Task } from './task/types';

// Utility function to decode and validate the JWT token
function isTokenValid() {
    // Retrieve the loginExpires value from localStorage
    const loginExpires = localStorage.getItem('loginExpires');

    if (!loginExpires) {
        console.log('No loginExpires value found in localStorage');
        return false; // No expiration time found
    }

    try {
        // Parse the stored timestamp
        const expiresAt = parseInt(loginExpires, 10);

        // Check if the current time is before the expiration time
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        return expiresAt > now; // Token is valid if the current time is before the expiration
    } catch (err) {
        console.error('Error parsing loginExpires:', err);
        return false; // Invalid or corrupted data in localStorage
    }
}

// Create a derived store to check the token dynamically
export const isLoggedIn = derived([], () => isTokenValid());

export const selectedTask: Writable<Task | null> = writable(null);