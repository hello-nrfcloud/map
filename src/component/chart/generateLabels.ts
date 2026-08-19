import { type chartMath, type XAxis } from './chartMath.ts'
import { subMinutes } from './dateMath.ts'

export const generateLabels = (
	{ startDate }: ReturnType<typeof chartMath>,
	xAxis: XAxis,
): string[] => {
	let labelTime: Date = startDate
	const labels: string[] = [xAxis.format(labelTime)]
	for (let i = 0; i <= xAxis.minutes / xAxis.labelEvery; i++) {
		labelTime = subMinutes(labelTime, -xAxis.labelEvery)
		labels.push(xAxis.format(labelTime))
	}
	return labels
}
