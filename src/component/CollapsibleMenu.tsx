import { type ParentProps, createSignal, Show } from 'solid-js'
import { Close, Menu as MenuIcon } from '../icons/LucideIcon.js'
import './CollapsibleMenu.css'

export const CollapsibleMenu = (props: ParentProps) => {
	const [collapsed, setCollapsed] = createSignal<boolean>(true)
	return (
		<div class={`collapsible ${collapsed() ? 'collapsed' : 'open'}`}>
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
				<div class="children">{props.children}</div>
				<div class="collapsible-close">
					<button
						type="button"
						title="collapse"
						onClick={() => setCollapsed(true)}
					>
						<Close strokeWidth={1} size={20} />
					</button>
				</div>
			</Show>
		</div>
	)
}
