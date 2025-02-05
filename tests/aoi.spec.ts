import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { loginUser } from './utils';


async function createAoi(page: Page) {
    await page.getByRole('button', { name: 'Add AOI' }).click();
    await page.getByRole('textbox', { name: 'Name' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill('Test Aoi');
    await page.getByRole('textbox', { name: 'Description' }).click();
    await page.getByRole('textbox', { name: 'Description' }).fill('Test Description');
    await page.getByRole('textbox', { name: '{ "type":Feature", "proerties":' }).click();
    await page.getByRole('textbox', { name: '{ "type":Feature", "proerties":' }).fill(' {\n      "type": "Feature",\n      "properties": {},\n      "geometry": {\n        "coordinates": [\n          [\n            [\n              13.38707469818317,\n              52.52489940499683\n            ],\n            [\n              13.387188976666494,\n              52.506331258557225\n            ],\n            [\n              13.418615559577205,\n              52.50587912719104\n            ],\n            [\n              13.417301357019198,\n              52.52430840514896\n            ],\n            [\n              13.38707469818317,\n              52.52489940499683\n            ]\n          ]\n        ],\n        "type": "Polygon"\n      }\n    }');

    // check if overview details are provided 
    await expect(page.getByText('Name Test Aoi')).toBeVisible();
    await expect(page.getByText('Description Test Descrip...')).toBeVisible();
    await expect(page.getByText('Area 4.29 km²')).toBeVisible();
    await expect(page.getByText('Perimeter 8.29 km')).toBeVisible();
    // save the aoi 
    await page.getByRole('button', { name: 'Save AOI' }).click();
    // wait for "AOI saved successfully"  toast
    await expect(page.getByText('AOI saved successfully')).toBeVisible();
    await page.getByRole('link', { name: 'AOIs' }).click();
}

test('Login and create and delete an aoi', async ({ page }) => {
    await loginUser(page);
    await createAoi(page);

    // check if the aoi is listed in the table
    await expect(page.getByRole('cell', { name: 'Test Aoi' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Test Description' })).toBeVisible();
    // delete the aoi
    await page.getByRole('button', { name: 'Delete' }).click();
    // check if the aoi is removed from the table
    await expect(page.locator('table')).not.toContainText('Test Aoi');
    await expect(page.locator('table')).not.toContainText('Test Description');

});