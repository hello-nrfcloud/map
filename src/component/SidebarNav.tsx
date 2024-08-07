import { SidebarButton as DeviceDetailButton } from './Device.js'
import { SidebarButton as ViewSourceButton } from './ViewSource.js'
import { SearchButton } from './Sidebar/SearchButton.js'
import { SidebarButton as TutorialButton } from './Tutorial/Tutorial.js'
import { SidebarButton as FeedbackButton } from './Feedback.js'

import './SidebarNav.css'

export const SidebarNav = () => (
	<nav class="sidebar">
		<TutorialButton />
		<SearchButton />
		<DeviceDetailButton />
		<FeedbackButton />
		<ViewSourceButton />
	</nav>
)
