import { Info } from '../icons/LucideIcon.jsx'
import { type ParentProps, Show, createSignal, type JSX } from 'solid-js'
import './InfoBlock.css'

export const InfoBlock = (props: ParentProps<{ title: JSX.Element }>) => {
	const [expanded, setExpanded] = createSignal<boolean>(false)

	return (
		<section class={expanded() ? 'info-block expanded' : 'info-block'}>
			<header>
				{props.title}
				<button type="button" onClick={() => setExpanded((e) => !e)}>
					<Info strokeWidth={1} size={20} />
				</button>
			</header>
			<Show when={expanded()}>{props.children}</Show>
		</section>
	)
}
