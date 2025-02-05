import { test, expect } from '@playwright/test';

test('Login with correct credentials', async ({ page }) => {

    await page.route('**/api/user/login', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                expires: Date.now() + 3600000, // 1 hour from now
                data: {
                    email: 'test@example.com'
                }
            })
        });
    });

    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('correct@correct.de');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('correct123456789');
    await page.getByRole('button', { name: 'Login' }).click();
    // Check if the user is redirected to the app
    await expect(page.getByRole('link', { name: 'AOIs' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Tasks' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Reports' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'AIPDET' })).toBeVisible();
});

test('Login with unverified email', async ({ page }) => {
    await page.route('**/api/user/login', async (route) => {
        await route.fulfill({
            status: 403,
            contentType: 'application/json',
            body: JSON.stringify({
                expires: Date.now() + 3600000, // 1 hour from now
                data: {
                    detail: "Email not verified. Please check your inbox."
                }
            })
        });
    });

    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('wrong@wrong.de');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('wrong123456789');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading', { name: 'Please verify your email' })).toBeVisible(); // need to be forwarded to the verification page

});

test('Login with incorrect credentials', async ({ page }) => {
    await page.route('**/api/user/login', async (route) => {
        await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({
                detail: 'Wrong email or password.'
            })
        });
    });
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('wrong@wrong.de');
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('wrong123456789');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('heading', { name: 'Error' }).click();
    await page.getByText('Wrong email or password.').click();
});