import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
export const handle: Handle = async ({ event, resolve }) => {
    const apiDomain = env.PUBLIC_VITE_BASE_URL_API

    const response = await resolve(event);

    response.headers.set(
        'Content-Security-Policy',
        [
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https://tile.jawg.io",
            `connect-src 'self' ws: wss: ${apiDomain}`,
            "default-src 'self'",
            "font-src 'self'",
            "frame-src 'self'",
            "object-src 'none'",
            "base-uri 'self'"
        ].join('; ')
    );

    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
};