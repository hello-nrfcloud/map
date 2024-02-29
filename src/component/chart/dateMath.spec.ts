import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { addMinutes, subMinutes } from './dateMath.js'

void describe('addMinutes', () => {
	void it('should add minutes to a date', () => {
		const date = new Date('2022-01-01T00:00:00')
		const result = addMinutes(date, 30)
		const expected = new Date('2022-01-01T00:30:00')
		assert.equal(result.getTime(), expected.getTime())
	})
})

void describe('subMinutes', () => {
	void it('should remove minutes from a date', () => {
		const date = new Date('2022-01-01T00:30:00')
		const result = subMinutes(date, 30)
		const expected = new Date('2022-01-01T00:00:00')
		assert.equal(result.getTime(), expected.getTime())
	})
})
