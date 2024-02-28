import { formatDistanceToNow } from 'date-fns'
import { Updated } from '../icons/LucideIcon.jsx'
import { createSignal, onCleanup, Show, type ParentProps } from 'solid-js'
import './RelativeTime.css'

export const RelativeTime = (
	props: ParentProps<{
		time: Date
	}>,
) => {
	const format = () => formatDistanceToNow(props.time).replace('about ', '~')
	const [formatted, setFormatted] = createSignal<string>(format())

	const i = setInterval(() => {
		setFormatted(format())
	}, getInterval(props.time))

	onCleanup(() => {
		clearInterval(i)
	})

	return (
		<time class="relative" dateTime={props.time.toISOString()}>
			<Show
				when={props.children !== undefined}
				fallback={<Updated size={12} strokeWidth={1} />}
			>
				{props.children}
			</Show>

			{formatted()}
		</time>
	)
}

const getInterval = (d: Date): number => {
	const delta = Date.now() - d.getTime() / 1000

	if (delta < 60) return 1000
	return 1000 * 60
}
