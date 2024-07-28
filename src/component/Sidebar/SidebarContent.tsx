import type { ParentProps } from 'solid-js'

import './SidebarContent.css'

export const SidebarContent = (
	props: ParentProps<{ class?: string; id: string }>,
) => (
	<aside class={`sidebar ${props.class ?? ''}`} id={props.id}>
		{props.children}
	</aside>
)
