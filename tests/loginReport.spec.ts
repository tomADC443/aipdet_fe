import { test, expect } from '@playwright/test';
import { loginUser } from './utils';

test('Login and visit reports', async ({ page }) => {
    await loginUser(page);
    await page.getByRole('link', { name: 'Reports' }).click();
    await expect(page.getByRole('heading', { name: 'Reportings' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'You have no Task selected' })).toBeVisible();
});

test('Login follow reports directions', async ({ page }) => {
    await loginUser(page);
    await page.getByRole('link', { name: 'Reports' }).click();
    await expect(page.getByRole('heading', { name: 'Reportings' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'You have no Task selected' })).toBeVisible();
    await page.getByRole('button', { name: 'Go to Tasks' }).click();
    await expect(page.getByRole('heading', { name: 'Tasks', exact: true })).toBeVisible();
});

