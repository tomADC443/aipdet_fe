import { test, expect } from '@playwright/test';

test('Login with correct credentials', async ({ page }) => {

    await page.goto('http://localhost:5173/');
    await expect(page.getByText('AipDet Features Contact Login')).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Features' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'AipDet' })).toBeVisible();

});
test('Action button should display access', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: 'Get Started!' }).click();

    await expect(page.getByRole('heading', { name: 'Access' })).toBeVisible();
});