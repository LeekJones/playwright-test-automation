const { test, expect } = require('@playwright/test');
const data = require('../data.json');

test.describe('Task Verification in Demo App', () => {
    test('should verify task details in the "To Do" column', async ({ page }) => {
        // Step 1: Log in to the Demo App
        await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/');
        await page.fill('input[id="username"]', data.login.username);
		await page.fill('input[id="password"]', data.login.password);
        await page.click('button[type="submit"]');

        // Step 2: Navigate to "Web Application" project
        const webAppButton = page.locator('button:has(h2:has-text("Web Application"))');
        await webAppButton.click();

        // Step 3: Verify "To Do" column has "Fix navigation bug"
        const todoColumn = page.locator('.flex.flex-col.w-80:has(h2:has-text("To Do"))');
        const task = todoColumn.locator('h3:has-text("Fix navigation bug")');
        await expect(task).toBeVisible();

        // Step 4: Verify the tag "Bug"
        const tags = task.locator('..').locator('.flex.flex-wrap.gap-2 span');
        await expect(tags.locator('text=Bug')).toBeVisible();

        // Step 5: Additional verification for description
        const description = task.locator('..').locator('p');
        await expect(description).toHaveText(/Menu does not close on mobile/);
    });
});