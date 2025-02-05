import { test, expect } from '@playwright/test';

test('Signup successfully', async ({ page }) => {

    await page.route('**/api/user/signup', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                expires: Date.now() + 3600000, // 1 hour from now
                data: {
                    detail: "Success"
                }
            })
        });
    });

    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Signup' }).click();
    await page.getByLabel("First name").click();
    await page.getByLabel("First name").fill('John');
    await page.getByLabel("Last name").click();
    await page.getByLabel("Last name").fill('Doe');
    await page.getByLabel("Email").click();
    await page.getByLabel("Email").fill('someEmail@tom.de');
    await page.getByLabel("Password").click();
    await page.getByLabel("Password").fill('123456789MyPw');
    await page.getByRole('button', { name: 'Create an account' }).click();
    await expect(page.getByRole('heading', { name: 'Please verify your email' })).toBeVisible();

});

test('Signup with invalid email', async ({ page }) => {

    await page.route('**/api/user/signup', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                expires: Date.now() + 3600000, // 1 hour from now
                data: {
                    detail: "Success"
                }
            })
        });
    });

    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Signup' }).click();
    await page.getByLabel("First name").click();
    await page.getByLabel("First name").fill('John');
    await page.getByLabel("Last name").click();
    await page.getByLabel("Last name").fill('Doe');
    await page.getByLabel("Email").click();
    await page.getByLabel("Email").fill('notanemail');
    await page.getByLabel("Password").click();
    await page.getByLabel("Password").fill('123456789MyPw');
    await page.getByRole('button', { name: 'Create an account' }).click();
    await expect(page.getByText('Invalid email')).toBeVisible();



});
