import { link } from '../util/link.js'
import { Close } from './LucideIcon.js'
import { SidebarContent } from './Sidebar.jsx'

export const WarningSidebar = () => (
	<SidebarContent class="warning">
		<header>
			<h1>Under construction!</h1>
			<a href={link('/#')} class="close">
				<Close size={20} />
			</a>
		</header>
		<hr />
		<div style={{ padding: '1rem' }}>
			<p>
				This website is under construction and not intended for production use.
			</p>
		</div>
	</SidebarContent>
)
