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
        await expect(page).toHaveURL('https://animated-gingersnap-8cf7f2.netlify.app/'); // Confirm login success
        await page.click('text=Web Application');

        // Step 3: Verify task "Implement user authentication" is in the "To Do" column
        const todoColumn = page.locator('.flex.flex-col.w-80:has(h2:has-text("To Do"))');
        const task = todoColumn.locator('h3:has-text("Implement user authentication")');
        await expect(task).toBeVisible();

        // Step 4: Confirm tags: "Feature" and "High Priority"
        const tags = task.locator('..').locator('.flex.flex-wrap.gap-2 span');
        await expect(tags.locator('text=Feature')).toBeVisible();
        await expect(tags.locator('text=High Priority')).toBeVisible();

        // Step 5: Additional verification for description
        const description = task.locator('..').locator('p');
        await expect(description).toHaveText(/Add login and signup functionality/);
    });
});
