import { createAuth0Client } from '@auth0/auth0-spa-js';

export const auth0 = await createAuth0Client({
	domain: 'dev-6qhci0d6a8rmjjps.eu.auth0.com',
	clientId: 'dEeLyCDKmG5pjyYh5CotkxvbeDIJiMBU',
	cacheLocation: 'localstorage'
});

export const logout = async () => {
	auth0.logout({
		logoutParams: {
			returnTo: 'http://localhost:5173/'
		}
	});
};

export const login = async () => {
	await auth0.loginWithRedirect({
		authorizationParams: {
			redirect_uri: 'http://localhost:5173/auth/callback'
		}
	});
};

export const signup = async () => {
	await auth0.loginWithRedirect({
		authorizationParams: {
			redirect_uri: 'http://localhost:5173/auth/callback',
			screen_hint: 'signup'
		}
	});
};

export const getUser = async (): Promise<User | undefined> => {
	return await auth0.getUser();
};

export declare class User {
	// Copy from Auth0Client.d.ts
	name?: string;
	given_name?: string;
	family_name?: string;
	middle_name?: string;
	nickname?: string;
	preferred_username?: string;
	profile?: string;
	picture?: string;
	website?: string;
	email?: string;
	email_verified?: boolean;
	gender?: string;
	birthdate?: string;
	zoneinfo?: string;
	locale?: string;
	phone_number?: string;
	phone_number_verified?: boolean;
	address?: string;
	updated_at?: string;
	sub?: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any;
}
