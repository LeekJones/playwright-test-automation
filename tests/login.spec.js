const { test, expect } = require('@playwright/test');
const data = require('../data.json');

test.describe('Login Automation', () => {
	test('should successfully log in with valid credentials', async ({ page }) => {
		// Navigate to the app
		await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/');

		// fill in the login form
		await page.fill('input[id="username"]', data.login.username);
		await page.fill('input[id="password"]', data.login.password);

		// Submit the form
		await page.click('button[type="submit"]');

		// Verify successful login
		await expect(page).toHaveURL('https://animated-gingersnap-8cf7f2.netlify.app');

		// Verify a UI element unique to the logged-in state\
		await expect(page.locator('text=Project')).toBeVisible(); //nReplace with a valid text or selector

	});
});
