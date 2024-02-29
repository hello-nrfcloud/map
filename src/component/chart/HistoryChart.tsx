import type { Size } from '../SizeObserver.jsx'
import { chartMath, type ChartData } from './chartMath.js'
import { generateLabels } from './generateLabels.js'

export const HistoryChart = (props: {
	data: ChartData
	padding?: number
	fontSize?: number
	size?: Size
}) => {
	let containerRef!: HTMLDivElement
	const { width, height } = props.size ?? {}
	const h = height ?? 300
	const w = width ?? 600
	const fontSize = props.fontSize ?? 14

	const m = chartMath({
		width: w,
		height: h,
		padding: props.padding ?? 30,
		startDate: new Date(),
		minutes: props.data.xAxis.minutes,
		labelEvery: props.data.xAxis.labelEvery,
	})

	const labels = generateLabels(m, props.data.xAxis)

	return (
		<div ref={containerRef}>
			<svg
				width={w}
				height={h}
				viewBox={`0 0 ${w} ${h}`}
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
			>
				{/* x axis labels and lines */}
				<g>
					{labels.map((label, index) => (
						<>
							<path
								stroke={props.data.xAxis.color}
								stroke-width={0.5}
								stroke-linecap={'butt'}
								stroke-linejoin={'miter'}
								stroke-miterlimit={4}
								fill={'none'}
								d={`M ${
									m.paddingLeft +
									m.xSpacing * props.data.xAxis.labelEvery * index
								},${m.paddingY} v ${m.yAxisHeight}`}
							/>
							{!props.data.xAxis.hideLabels &&
								index > 0 &&
								index < labels.length - 1 && (
									<text
										x={
											m.paddingLeft +
											m.xSpacing * props.data.xAxis.labelEvery * index
										}
										y={h}
										text-anchor="middle"
										font-size={fontSize.toString()}
										fill={props.data.xAxis.color}
									>
										{label}
									</text>
								)}
						</>
					))}
				</g>
				{/* y axis markers */}
				<g>
					{props.data.datasets.map((_, index) => {
						const length = fontSize - (fontSize * 1) / 3
						const xPos =
							index === 0 ? m.paddingLeft - length : w - m.paddingLeft
						return (
							<>
								<path
									stroke={props.data.xAxis.color}
									stroke-width={0.5}
									stroke-linecap={'round'}
									stroke-linejoin={'round'}
									stroke-miterlimit={2}
									d={`M ${xPos},${m.paddingY} h ${length}`}
								/>
								<path
									stroke={props.data.xAxis.color}
									stroke-width={0.5}
									stroke-linecap={'round'}
									stroke-linejoin={'round'}
									stroke-miterlimit={2}
									d={`M ${xPos},${m.paddingY + m.yAxisHeight} h ${length}`}
								/>
							</>
						)
					})}
				</g>
				{/* y axis labels */}
				<g>
					{props.data.datasets.map(({ min, max, format }, index) => {
						const xPos =
							index === 0
								? m.paddingLeft - fontSize
								: m.paddingLeft +
									m.xSpacing *
										props.data.xAxis.labelEvery *
										(labels.length - 1) +
									fontSize
						const anchor = index === 0 ? 'end' : 'start'
						return (
							<>
								<text
									fill={props.data.xAxis.color}
									opacity={0.5}
									font-weight={700}
									x={xPos}
									y={m.paddingY + fontSize / 3}
									text-anchor={anchor}
									font-size={fontSize.toString()}
								>
									{format(max)}
								</text>
								<text
									fill={props.data.xAxis.color}
									opacity={0.5}
									font-weight={700}
									x={xPos}
									y={m.paddingY + m.yAxisHeight + fontSize / 3}
									text-anchor={anchor}
									font-size={fontSize.toString()}
								>
									{format(min)}
								</text>
							</>
						)
					})}
				</g>
				{/* datasets lines */}
				{props.data.datasets.map((dataset) => {
					const lineDefinition: string[] = []
					for (let i = 0; i < dataset.values.length; i++) {
						const [v, ts] = dataset.values[i] as [number, Date]
						const x = m.xPosition(ts)
						if (x === null) continue
						if (i === 0) {
							lineDefinition.push(`M ${x},${m.yPosition(dataset, v)}`)
						} else {
							lineDefinition.push(`L ${x},${m.yPosition(dataset, v)}`)
						}
					}
					return (
						<path
							stroke={dataset.color}
							stroke-width={2}
							stroke-linecap={'round'}
							stroke-linejoin={'round'}
							stroke-miterlimit={2}
							fill={'none'}
							d={lineDefinition.join(' ')}
						/>
					)
				})}
				{/* dataset labels */}
				{props.data.datasets.map((dataset) => {
					const labels = []
					for (let i = 0; i < dataset.values.length; i++) {
						if (i % props.data.xAxis.labelEvery === 0) {
							const [v, ts] = dataset.values[i] as [number, Date]
							const x = m.xPosition(ts)
							if (x === null) continue
							labels.push(
								<circle
									fill={'none'}
									stroke={dataset.color}
									stroke-width={2}
									stroke-linecap={'round'}
									stroke-linejoin={'round'}
									stroke-miterlimit={2}
									cy={m.yPosition(dataset, v)}
									cx={x}
									r="6"
								/>,
							)
							labels.push(
								<text
									fill={dataset.color}
									font-weight={700}
									y={m.yPosition(dataset, v) - m.padding / 2}
									x={x}
									text-anchor="middle"
									font-size={fontSize.toString()}
								>
									{dataset.format(v)}
								</text>,
							)
						}
					}
					return labels
				})}
			</svg>
		</div>
	)
}
