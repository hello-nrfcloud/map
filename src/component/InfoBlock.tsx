import { Info } from '#icons/LucideIcon.js'
import { Show, createSignal, type JSX, type ParentProps } from 'solid-js'
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
