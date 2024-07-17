import { type ParentProps, createSignal, Show } from 'solid-js'
import { Close, Menu as MenuIcon } from '../icons/LucideIcon.js'
import './CollapsibleMenu.css'

export const CollapsibleMenu = (props: ParentProps<{ class?: string }>) => {
	const [collapsed, setCollapsed] = createSignal<boolean>(true)
	return (
		<nav
			class={`collapsible ${collapsed() ? 'collapsed' : 'open'} ${props.class ?? ''}`}
		>
			<Show
				when={!collapsed()}
				fallback={
					<button
						type="button"
						title="open"
						onClick={() => setCollapsed(false)}
					>
						<MenuIcon strokeWidth={1} size={20} />
					</button>
				}
			>
				<span class="children">{props.children}</span>
				<span class="collapsible-close">
					<button
						type="button"
						title="collapse"
						onClick={() => setCollapsed(true)}
					>
						<Close strokeWidth={1} size={20} />
					</button>
				</span>
			</Show>
		</nav>
	)
}
