import { test, expect } from '@playwright/test'

test('Under Construction Warning', async ({ page }) => {
	await page.goto('/')
	await page.getByRole('link', { name: 'Warning: Under construction!' }).click()
	const warningLoc = () =>
		page.getByText(
			'This website is under construction and not intended for production use.',
		)
	await expect(warningLoc()).toBeVisible()
	await expect(page.getByRole('link', { name: 'Close' })).toBeVisible()
	await page.getByRole('link', { name: 'Close' }).click()
	await expect(warningLoc()).not.toBeVisible()
})
