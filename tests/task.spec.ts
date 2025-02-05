import { test, expect } from '@playwright/test';
import { loginUser } from './utils';

test('Login and visit task', async ({ page }) => {
    await loginUser(page);
    await page.getByRole('link', { name: 'Tasks' }).click();
    await page.getByRole('heading', { name: 'Tasks', exact: true }).click();
    await page.getByRole('heading', { name: 'You Have No Tasks' }).click();
    await expect(page.getByRole('heading', { name: 'Tasks', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'You Have No Tasks' })).toBeVisible();
    await page.getByRole('button', { name: 'Add Task' }).click();
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Sample Task');
    await page.getByRole('combobox').click();
    await expect(page.getByRole('button', { name: 'Create Task' })).toBeVisible();
});

test('Login follow reports directions', async ({ page }) => {
    await loginUser(page);
    await page.getByRole('link', { name: 'Reports' }).click();
    await expect(page.getByRole('heading', { name: 'Reportings' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'You have no Task selected' })).toBeVisible();
    await page.getByRole('button', { name: 'Go to Tasks' }).click();
    await expect(page.getByRole('heading', { name: 'Tasks', exact: true })).toBeVisible();
});

