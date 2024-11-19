import { writable } from 'svelte/store';
import { auth0 } from '../auth/service';
import type { Writable } from 'svelte/store';


// Check if user login status exists in localStorage
export const isUserLoggedIn: Writable<boolean> = writable(await auth0.isAuthenticated());
export const updateAuthStatus = async () => {
    isUserLoggedIn.set(await auth0.isAuthenticated());
}

