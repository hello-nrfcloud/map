import { Show, type Accessor, type Setter } from 'solid-js'
import { Collapse, Expand } from '../icons/LucideIcon.js'

export const CollapseButton = (props: {
	expanded: Accessor<boolean>
	setExpanded: Setter<boolean>
}) => (
	<Show
		when={props.expanded()}
		fallback={
			<button
				type="button"
				aria-expanded={false}
				onClick={() => props.setExpanded(true)}
			>
				<Expand size={20} strokeWidth={1} />
			</button>
		}
	>
		<button
			type="button"
			aria-expanded={true}
			onClick={() => props.setExpanded(false)}
		>
			<Collapse size={20} strokeWidth={1} />
		</button>
	</Show>
)
