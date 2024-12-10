const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    use: {
        viewport: null, // Enable fullscreen mode
        trace: 'on',    // Enable trace viewer
        headless: false, // Optional: Run tests in headed mode
    },
});
