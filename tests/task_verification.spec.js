const { test, expect } = require('@playwright/test');
const data = require('../data.json');

// Reusable function: Log in to the Demo App
async function login(page, testCaseNumber) {
    console.log(`[Test Case ${testCaseNumber}] Logging into the Demo App...`);
    await page.goto(data.app.url);
    await page.screenshot({ path: `screenshots/test_case_${testCaseNumber}_before_login.png` }); // Before login
    await page.fill('input[id="username"]', data.login.username);
    await page.fill('input[id="password"]', data.login.password);
    await page.screenshot({ path: `screenshots/test_case_${testCaseNumber}_after_fill_login.png` }); // After filling login form
    await page.click('button[type="submit"]');
    await page.screenshot({ path: `screenshots/test_case_${testCaseNumber}_after_login.png` }); // After login
    await expect(page).toHaveURL(data.app.url); // Confirm login success
    console.log(`[Test Case ${testCaseNumber}] Login successful`);
}

// Reusable function: Navigate to a project
async function navigateToProject(page, projectName, testCaseNumber) {
    console.log(`[Test Case ${testCaseNumber}] Navigating to project: ${projectName}...`);
    await page.screenshot({ path: `screenshots/test_case_${testCaseNumber}_before_navigation.png` }); // Before navigation
    const projectButton = page.locator(`button:has(h2:has-text("${projectName}"))`);
    await projectButton.click();
    await page.screenshot({ path: `screenshots/test_case_${testCaseNumber}_after_navigation.png` }); // After navigation
    console.log(`[Test Case ${testCaseNumber}] Successfully navigated to: ${projectName}`);
}

// Reusable function: Verify task details
async function verifyTaskDetails(page, columnName, taskName, expectedTags, testCaseNumber) {
    console.log(`[Test Case ${testCaseNumber}] Verifying task: "${taskName}" in column: "${columnName}"...`);
    await page.screenshot({ path: `screenshots/test_case_${testCaseNumber}_before_verify.png` }); // Before verification
    const column = page.locator(`.flex.flex-col.w-80:has(h2:has-text("${columnName}"))`);
    const task = column.locator(`h3:has-text("${taskName}")`);
    await expect(task).toBeVisible();
    console.log(`[Test Case ${testCaseNumber}] Task "${taskName}" is visible in column: "${columnName}"`);

    const tags = task.locator('..').locator('.flex.flex-wrap.gap-2 span');
    for (const tag of expectedTags) {
        await expect(tags.locator(`text=${tag}`)).toBeVisible();
        console.log(`[Test Case ${testCaseNumber}] Tag "${tag}" verified for task: "${taskName}"`);
    }

    await page.screenshot({ path: `screenshots/test_case_${testCaseNumber}_after_verify.png` }); // After verification
    await page.waitForTimeout(2000); // Pause for observation
}

test.describe('Task Verification in Demo App (With Trace Viewer)', () => {
    test.beforeEach(async ({ page }, testInfo) => {
        await login(page, testInfo.title.match(/\d+/)[0]); // Pass test case number dynamically
    });

    test('Test Case 1: Verify "Implement user authentication" task in "To Do" column', async ({ page }) => {
        await navigateToProject(page, "Web Application", 1);
        await verifyTaskDetails(page, "To Do", "Implement user authentication", ["Feature", "High Priority"], 1);
    });

    test('Test Case 2: Verify "Fix navigation bug" task in "To Do" column', async ({ page }) => {
        await navigateToProject(page, "Web Application", 2);
        await verifyTaskDetails(page, "To Do", "Fix navigation bug", ["Bug"], 2);
    });

    test('Test Case 3: Verify "Design system updates" task in "In Progress" column', async ({ page }) => {
        await navigateToProject(page, "Web Application", 3);
        await verifyTaskDetails(page, "In Progress", "Design system updates", ["Design"], 3);
    });

    test('Test Case 4: Verify "Push notification system" task in "To Do" column', async ({ page }) => {
        await navigateToProject(page, "Mobile Application", 4);
        await verifyTaskDetails(page, "To Do", "Push notification system", ["Feature"], 4);
    });

    test('Test Case 5: Verify "Offline mode" task in "In Progress" column', async ({ page }) => {
        await navigateToProject(page, "Mobile Application", 5);
        await verifyTaskDetails(page, "In Progress", "Offline mode", ["Feature", "High Priority"], 5);
    });

    test('Test Case 6: Verify "App icon design" task in "Done" column', async ({ page }) => {
        await navigateToProject(page, "Mobile Application", 6);
        await verifyTaskDetails(page, "Done", "App icon design", ["Design"], 6);
    });
});
