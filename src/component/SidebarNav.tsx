import type { ParentProps } from 'solid-js'

import './SidebarNav.css'

export const SidebarNav = (props: ParentProps) => (
	<nav class="sidebar">{props.children}</nav>
)
