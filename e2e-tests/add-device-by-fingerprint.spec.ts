import { generateCode } from '@hello.nrfcloud.com/proto/fingerprint'
import { expect, test } from '@playwright/test'

test('Add an out-of-box experience device using its fingerprint', async ({
	page,
}) => {
	const fingerprint = `29a.${generateCode()}`
	// The link is opened from the device page on hello.nrfcloud.com
	await page.goto(
		`/map/dashboard/#add-device?${new URLSearchParams({ fingerprint, model: 'thingy91x' }).toString()}`,
	)

	await page.getByPlaceholder('e.g. "alex@example.com').fill('alex@example.com')
	await page.getByPlaceholder('e.g. "alex@example.com').blur()
	await page.getByRole('button', { name: 'send confirmation token' }).click()

	await page.getByPlaceholder('e.g. "3S5N7Q"').click()
	await page.getByPlaceholder('e.g. "3S5N7Q"').fill('ABC123') // should auto-submit

	await expect(page.getByTestId('device-model')).toBeVisible()
	await expect(page.getByTestId('device-model')).toHaveText('thingy91x')
	await expect(page.getByTestId('device-deviceId')).toBeVisible()
	await expect(page.getByTestId('device-deviceId')).toHaveText(
		/oob-3526561666[0-9]+/,
	)
	await page.getByRole('button', { name: 'share device' }).click()

	await expect(
		page.getByText('We will now show data sent by the device on the map!'),
	).toBeVisible()
	await expect(page.getByTestId('device-id')).toBeVisible()
	const publicId = (await page.getByTestId('device-id').innerHTML()).trim()
	console.log(publicId)
	await page.getByText('Here is a link to your device').click()
	await expect(page).toHaveURL(new RegExp(`/map/#id:${publicId}`))
	await expect(page.getByText('No state available.')).toBeVisible()
})
