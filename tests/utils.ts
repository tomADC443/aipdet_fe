
import { expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { testUser } from './constants';


export async function loginUser(page: Page) {
    await page.goto('http://localhost:5173/');
    await page.getByRole('link', { name: 'Login' }).click();
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(testUser.email);
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(testUser.password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page).toHaveURL('http://localhost:5173/app/aoi');
}