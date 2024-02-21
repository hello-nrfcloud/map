import assert from 'node:assert/strict'
import { it, describe } from 'node:test'
import { trimTrailingSlash } from './trimTrailingSlash.js'

void describe('trimTrailingSlash()', () => {
	for (const [input, expected] of [
		['/', ''],
		['//', ''],
		['/map/', '/map'],
		['/map//', '/map'],
	] as [string, string][]) {
		void it(`should replace trailing slashes in "${input}" to "${expected}"`, () =>
			assert.equal(trimTrailingSlash(input), expected))
	}
})
