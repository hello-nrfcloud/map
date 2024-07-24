import { type ParentProps, Show } from 'solid-js'
import { Close, Menu as MenuIcon } from '../icons/LucideIcon.js'
import './CollapsibleMenu.css'
import { useNavigation } from '../context/Navigation.tsx'

export const CollapsibleMenu = (
	props: ParentProps<{ id: string; title?: string; class?: string }>,
) => {
	const navigation = useNavigation()
	const toggleId = () => `cm;${props.id}`
	const expanded = () => navigation.current().toggled.includes(toggleId())
	return (
		<nav
			class={`collapsible ${!expanded() ? 'collapsed' : 'open'} ${props.class ?? ''}`}
		>
			<Show
				when={expanded()}
				fallback={
					<button
						type="button"
						onClick={() => navigation.toggle(toggleId())}
						title={`Open ${props.title ?? 'context menu'}`}
					>
						<MenuIcon strokeWidth={1} size={20} />
					</button>
				}
			>
				<span class="children">{props.children}</span>
				<span class="collapsible-close">
					<button
						type="button"
						title={`Collapse ${props.title ?? 'context menu'}`}
						onClick={() => navigation.toggle(toggleId())}
						class="collapsible-close"
					>
						<Close strokeWidth={1} size={20} />
					</button>
				</span>
			</Show>
		</nav>
	)
}
