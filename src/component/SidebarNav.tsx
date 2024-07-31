import { SidebarButton as DeviceDetailButton } from './Device.js'
import { SidebarButton as ViewSourceButton } from './ViewSource.js'
import { SidebarButton as AddDeviceButton } from './AddDevice.js'
import { SearchButton } from './Sidebar/SearchButton.tsx'
import { SidebarButton as TutorialButton } from './Tutorial/Tutorial.tsx'

import './SidebarNav.css'

export const SidebarNav = () => (
	<nav class="sidebar">
		<SearchButton />
		<DeviceDetailButton />
		<AddDeviceButton />
		<ViewSourceButton />
		<TutorialButton />
	</nav>
)
