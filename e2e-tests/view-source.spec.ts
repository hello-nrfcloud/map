import { expect, test } from '@playwright/test'
import assert from 'assert/strict'

test('View source should display the build time', async ({ page }) => {
	await page.goto('/')
	await page.getByRole('link', { name: 'View source' }).click()
	await page.locator('#view-source .scrollable').click()
	await page.mouse.wheel(0, 500)
	// should show the build time
	await expect(page.locator('time.build-time')).toBeVisible()
	const buildTime = await page
		.locator('time.build-time')
		.getAttribute('datetime')
	assert.equal(new Date(buildTime ?? '0').getTime() < Date.now(), true)
	await page.getByRole('link', { name: 'Close' }).click()
})

test('view-source should display the version', async ({ page }) => {
	await page.goto('/')
	await page.getByRole('link', { name: 'View Source' }).click()
	await page.locator('#view-source .scrollable').click()
	await page.mouse.wheel(0, 1000)
	await expect(page.getByTestId('backend-version')).toHaveText(
		'0.0.0-development',
	)
})
