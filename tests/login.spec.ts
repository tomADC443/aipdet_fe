
import { test, expect } from '@playwright/test';
import { loginUser } from './utils';


test('Login with existing user', async ({ page }) => {
    await loginUser(page);
});
test('Login and logout with existing user', async ({ page }) => {
    await loginUser(page);
    await page.getByRole('button', { name: 'Toggle user menu' }).click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();
    await expect(page.getByRole('heading', { name: 'Unlock Insights From Space' })).toBeVisible();
    await expect(page).toHaveURL('http://localhost:5173');
});