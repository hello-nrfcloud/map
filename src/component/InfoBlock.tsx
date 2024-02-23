import { Info } from './LucideIcon.js'
import { type ParentProps, Show, createSignal } from 'solid-js'
import './InfoBlock.css'

export const InfoBlock = ({
	title,
	children,
}: ParentProps<{ title: string }>) => {
	const [expanded, setExpanded] = createSignal<boolean>(false)
	return (
		<div class={expanded() ? 'info-block expanded' : 'info-block'}>
			<header>
				<h2>{title}</h2>
				<button type="button" onClick={() => setExpanded((e) => !e)}>
					<Info strokeWidth={1} size={20} />
				</button>
			</header>
			<Show when={expanded()}>{children}</Show>
		</div>
	)
}
