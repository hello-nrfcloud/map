import { addMinutes } from './dateMath.js'

export type Values = [value: number, ts: Date][]

export type Dataset = {
	min: number
	max: number
	values: Values
	color: string
	format: (v: number) => string
}
export type XAxis = {
	minutes: number
	color: string
	labelEvery: number
	/**
	 * The minimum distance between two value labels
	 */
	minValueDistancePX: number
	format: (d: Date) => string
	hideLabels: boolean
}
export type ChartData = {
	xAxis: XAxis
	datasets: Dataset[]
}
export const chartMath = ({
	width,
	height,
	padding,
	startDate,
	minutes,
	labelEvery,
}: {
	width: number
	height: number
	padding: number
	startDate: Date
	/**
	 * Number of Minutes to display in the chart
	 */
	minutes: number
	labelEvery: number
}): {
	yPosition: (dataset: Pick<Dataset, 'min' | 'max'>, value: number) => number
	xPosition: (ts: Date) => number | null
	yAxisHeight: number
	xAxisWidth: number
	padding: number
	startDate: Date
	endDate: Date
	xSpacing: number
	paddingLeft: number
	paddingTop: number
	paddingBottom: number
} => {
	const numPaddingLeft = 1.5
	const numPaddingRight = 1
	const paddingTop = padding * 0.75
	const paddingBottom = padding * 0.5
	const yAxisHeight = height - (paddingTop + paddingBottom) // 1 padding at bottom if labels are not hidden
	const xAxisWidth = width - padding * (numPaddingLeft + numPaddingRight)
	const xSpacing = xAxisWidth / ((minutes / labelEvery + 1) * labelEvery)
	const nextTenMinutes = addMinutes(
		startDate,
		10 - (startDate.getMinutes() % 10),
	)
	nextTenMinutes.setSeconds(0)

	const prevTenMinutes = addMinutes(
		startDate,
		10 - (startDate.getMinutes() % 10) - minutes,
	)
	prevTenMinutes.setSeconds(0)

	const startTs = nextTenMinutes.getTime()
	const endTs = prevTenMinutes.getTime()

	return {
		yPosition: (
			{ min, max }: Pick<Dataset, 'min' | 'max'>,
			value: number,
		): number => {
			const valueAsPercent = Math.max(
				0,
				Math.min(1, ((value ?? 0) - min) / (max - min)),
			)
			return yAxisHeight + paddingTop - valueAsPercent * yAxisHeight
		},
		xPosition: (ts: Date): number | null => {
			const tsInt = ts.getTime()
			if (tsInt < endTs) return null
			if (tsInt > startTs) return null
			const timeAsPercent = Math.max(
				0,
				Math.min(1, (tsInt - endTs) / (startTs - endTs)),
			)
			return numPaddingLeft * padding + timeAsPercent * xAxisWidth
		},
		yAxisHeight,
		xAxisWidth,
		padding,
		startDate: nextTenMinutes,
		endDate: prevTenMinutes,
		xSpacing,
		paddingLeft: padding * numPaddingLeft,
		paddingTop,
		paddingBottom,
	}
}
