import { Updated } from '../icons/LucideIcon.jsx'
import { createSignal, onCleanup, Show, type ParentProps } from 'solid-js'
import './RelativeTime.css'

const fmt = new Intl.NumberFormat()

export const RelativeTime = (
	props: ParentProps<{
		time: Date
	}>,
) => {
	const format = () => distance(props.time)
	const [formatted, setFormatted] = createSignal<Distance>(format())

	const i = setInterval(() => {
		setFormatted(format())
	}, getInterval(props.time))

	onCleanup(() => {
		clearInterval(i)
	})

	return (
		<time
			class="relative"
			dateTime={props.time.toISOString()}
			title={`${fmt.format(formatted().delta)} ${formatted().unit.long} ago (${props.time.toISOString()})`}
		>
			<Show
				when={props.children !== undefined}
				fallback={<Updated size={12} strokeWidth={1} />}
			>
				{props.children}
			</Show>
			{fmt.format(formatted().delta)} {formatted().unit.short}
		</time>
	)
}

const getInterval = (d: Date): number => {
	const delta = Date.now() - d.getTime() / 1000

	if (delta < 60) return 1000
	return 1000 * 60
}

type Distance = {
	delta: number
	unit: {
		short: string
		long: string
	}
}
const distance = (d: Date, now = Date.now()): Distance => {
	const then = d.getTime()
	const delta = now - then

	if (delta > 24 * 60 * 60 * 1000) {
		const daysDistance = Math.ceil(delta / 1000 / 60 / 60 / 24)
		return {
			delta: daysDistance,
			unit: {
				short: 'd',
				long: isSingular(daysDistance) ? 'day' : 'days',
			},
		}
	}

	if (delta > 60 * 60 * 1000) {
		const hoursDistance = Math.ceil(delta / 1000 / 60 / 60)
		return {
			delta: hoursDistance,
			unit: {
				short: 'h',
				long: isSingular(hoursDistance) ? 'hour' : 'hours',
			},
		}
	}

	if (delta > 60 * 1000) {
		const minutesDistance = Math.ceil(delta / 1000 / 60)
		return {
			delta: minutesDistance,
			unit: {
				short: 'm',
				long: isSingular(minutesDistance) ? 'minute' : 'minutes',
			},
		}
	}

	const secondsDistance = Math.ceil(delta / 1000)
	return {
		delta: secondsDistance,
		unit: {
			short: 's',
			long: isSingular(secondsDistance) ? 'second' : 'seconds',
		},
	}
}

const isSingular = (n: number) => (n === 1 ? true : false)
