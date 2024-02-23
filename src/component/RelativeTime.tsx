import { formatDistanceToNow } from 'date-fns'
import { Updated } from './LucideIcon.js'
import { createSignal, onCleanup } from 'solid-js'

export const RelativeTime = ({ time }: { time: Date }) => {
	const format = () => formatDistanceToNow(time, { addSuffix: true })
	const [formatted, setFormatted] = createSignal<string>(format())

	const i = setInterval(() => {
		setFormatted(format())
	}, getInterval(time))

	onCleanup(() => {
		clearInterval(i)
	})

	return (
		<time dateTime={time.toISOString()}>
			<Updated size={12} strokeWidth={1} />
			{formatted()}
		</time>
	)
}

const getInterval = (d: Date): number => {
	const delta = Date.now() - d.getTime() / 1000

	if (delta < 60) return 1000
	return 1000 * 60
}
