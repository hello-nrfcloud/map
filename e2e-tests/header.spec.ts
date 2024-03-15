import { test as it, expect } from '@playwright/test'

it('has title', async ({ page }) => {
	await page.goto('/')
	await expect(page).toHaveTitle(/hello.nrfcloud.com\/map/)
})

it('has shows the Nordic Semiconductor logo', async ({ page }) => {
	await page.goto('about:blank')
	await page.goto('/')
	await expect(
		page.getByRole('img', { name: 'Nordic Semiconductor', exact: true }),
	).toBeVisible()
	await expect(
		page.getByRole('img', { name: 'Nordic Semiconductor Logo', exact: true }),
	).toBeVisible()
})
