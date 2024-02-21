import type { Device } from '../context/Devices.jsx'
import { link } from '../util/link.js'
import { Close } from './LucideIcon.js'
import { SidebarContent } from './Sidebar.js'

export const DeviceSidebar = ({ device }: { device: Device }) => (
	<SidebarContent>
		<header>
			<h1>
				<code>{device.id}</code>
			</h1>
			<a href={link('/#')} class="close">
				<Close size={20} />
			</a>
		</header>
		<div style={{ padding: '1rem' }}>
			<div class="boxed">
				<p>Model: {device.model}</p>
			</div>
		</div>
	</SidebarContent>
)
