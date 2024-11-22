import { writable } from 'svelte/store';
import { auth0 } from '../auth/service';
import type { Writable } from 'svelte/store';
import { error } from '@sveltejs/kit';


// Check if user login status exists in localStorage
export const isUserLoggedIn: Writable<boolean> = writable(await auth0.isAuthenticated());
export const updateAuthStatus = async () => {
    isUserLoggedIn.set(await auth0.isAuthenticated());
}
type SelectedProcessInfo = {
    id: string,
    processName: string,
    createdAt: string,
    status: string,
}
export const selectedProcess: Writable<SelectedProcessInfo | null> = writable(await getSelectedProcessIdFromURL());

export async function getSelectedProcessIdFromURL(): Promise<SelectedProcessInfo | null> {
    const queryParam = new URLSearchParams(window.location.search).get('selected_process_id') || '';
    if (!queryParam) return null;
    return await getProcessInfoFromId(queryParam);
}
async function getProcessInfoFromId(selectedProcessId: string): Promise<SelectedProcessInfo | null> {
    // Fetch process info from API
    const isError = false;
    if (isError) {
        window.history.replaceState({}, document.title, window.location.pathname);
        throw error(404, 'Entry for id not valid or deleted');
    }
    return Promise.resolve({
        id: selectedProcessId,
        processName: 'Some Name Here',
        createdAt: '1732042266',
        status: 'completed',
    })
}
