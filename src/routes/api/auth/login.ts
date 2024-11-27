import type { RequestHandler } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

import { db } from '$lib/db'; // Your database utility

const JWT_SECRET = 'your_jwt_secret';
const JWT_EXPIRY = '15m';

export const POST: RequestHandler = async ({ request }) => {
    const { email, password } = await request.json();

    // Fetch user from database
    const user = await db.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.hashed_password))) {
        return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

    return new Response(JSON.stringify({ token }), { status: 200 });
};
