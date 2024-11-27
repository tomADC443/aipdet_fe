import { createAuth0Client, type CacheLocation } from '@auth0/auth0-spa-js';

export const auth0 = await createAuth0Client({
	domain: import.meta.env.VITE_AUTH0_DOMAIN as string,
	clientId: import.meta.env.VITE_AUTH0_CLIENT_ID as string,
	cacheLocation: import.meta.env.VITE_AUTH0_CACHE_LOCATION as CacheLocation,
});

export const logout = async () => {
	auth0.logout({
		logoutParams: {
			returnTo: `${import.meta.env.VITE_BASE_URL}/`

		}
	});
};

export const login = async () => {
	console.log(`${import.meta.env.VITE_BASE_URL}/auth/callback`);
	await auth0.loginWithRedirect({

		authorizationParams: {
			redirect_uri: `${import.meta.env.VITE_BASE_URL}/auth/callback`,
			audience: 'AIPDET-API'
		}
	});
};

export const signup = async () => {
	await auth0.loginWithRedirect({
		authorizationParams: {
			redirect_uri: `${import.meta.env.VITE_BASE_URL}/auth/callback`,
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
