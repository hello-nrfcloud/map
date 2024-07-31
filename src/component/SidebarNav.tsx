import { SidebarButton as DeviceDetailButton } from './Device.js'
import { SidebarButton as ViewSourceButton } from './ViewSource.js'
import { SidebarButton as AddDeviceButton } from './AddDevice.js'
import { SearchButton } from './Sidebar/SearchButton.js'
import { SidebarButton as TutorialButton } from './Tutorial/Tutorial.js'
import { SidebarButton as FeedbackButton } from './Feedback.js'
import { SidebarButton as ProtocolButton } from './Protocol.js'

import './SidebarNav.css'

export const SidebarNav = () => (
	<nav class="sidebar">
		<SearchButton />
		<DeviceDetailButton />
		<AddDeviceButton />
		<ProtocolButton />
		<ViewSourceButton />
		<TutorialButton />
		<FeedbackButton />
	</nav>
)
