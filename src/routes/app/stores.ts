import { derived } from 'svelte/store';

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




import { writable } from 'svelte/store';

import type { Writable } from 'svelte/store';
import { TaskStatus } from './task/constants';


export type SelectedTaskInfo = {
    id: string,
    taskName: string,
    createdAt: number,
    status: TaskStatus,
}
export const selectedTask: Writable<SelectedTaskInfo | null> = writable(null);

// export async function getSelectedTaskIdFromURL(): Promise<SelectedTaskInfo | null> {
//     const queryParam = new URLSearchParams(window.location.search).get('selected_process_id') || '';
//     if (!queryParam) return null;
//     return await getProcessInfoFromId(queryParam);
// }
// async function getProcessInfoFromId(selectedProcessId: string): Promise<SelectedTaskInfo | null> {
//     // Fetch process info from API
//     const isError = false;
//     if (isError) {
//         window.history.replaceState({}, document.title, window.location.pathname);
//         throw error(404, 'Entry for id not valid or deleted');
//     }
//     return Promise.resolve({
//         id: selectedProcessId,
//         taskName: 'Some Name Here',
//         createdAt: 1732042266,
//         status: 'completed',
//     })
// }
