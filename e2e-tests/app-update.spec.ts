import { expect, test } from '@playwright/test'
import { mockBackendApi } from './lib/mock-backend.ts'

test.describe('App-Update notification', () => {
	test.skip('A notification should appear if the app is outdated', async ({
		page,
	}) => {
		await mockBackendApi.setRelease('1.2.3')
		await page.goto('/')
		await expect(page.getByText('Update available!')).toBeVisible()
		await expect(
			page.getByText(
				'A new version (1.2.3) of this web application is available.',
			),
		).toBeVisible()
		await mockBackendApi.setRelease('0.0.0-development') // reset to default
		await page.getByRole('link', { name: 'reload' }).click()
		await expect(page.getByText('Update available!')).not.toBeVisible()
	})

	test('view-source should display the version', async ({ page }) => {
		await page.goto('/')
		await page.getByRole('link', { name: 'View Source' }).click()
		await page.locator('#view-source .scrollable').click()
		await page.mouse.wheel(0, 500)
		await expect(page.getByTestId('version')).toHaveText('0.0.0-development')
	})
})
