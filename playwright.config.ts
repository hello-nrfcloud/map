import { defineConfig, devices } from '@playwright/test'

const isCI = process.env.CI !== undefined
const baseURL = 'http://localhost:8080/map/'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './e2e-tests',
	/* Run tests in files in parallel */
	fullyParallel: false,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: isCI,
	/* Retry on CI only */
	retries: isCI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: isCI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL,
		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		...(isCI
			? [
					{
						name: 'firefox',
						use: { ...devices['Desktop Firefox'] },
					},

					{
						name: 'webkit',
						use: { ...devices['Desktop Safari'] },
					},
				]
			: []),
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: 'npm run start:e2e',
		url: baseURL,
		reuseExistingServer: !isCI,
		stderr: 'pipe',
		stdout: 'pipe',
	},
})
