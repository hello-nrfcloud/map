import { expect, test as it } from '@playwright/test'

it('should center the map in Trondheim', async ({ page }) => {
	await page.goto('/')
	await expect(page).toHaveURL(
		/\/map\/#world!m:1:63\.421065865928355,10\.437128259586967/,
	)
})
