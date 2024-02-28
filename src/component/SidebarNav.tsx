import { useNavigation } from '../context/Navigation.js'
import { SidebarButton as AppUpdateRequiredButton } from './AppUpdate.js'
import { SidebarButton as DeviceDetailButton } from './Device.js'
import { SidebarButton as ViewSourceButton } from './ViewSource.js'
import { SidebarButton as AddDeviceButton } from './AddDevice.js'
import { WarningButton, SearchButton } from './Sidebar.jsx'

import './SidebarNav.css'

export const SidebarNav = () => {
	const location = useNavigation()
	return (
		<nav class="sidebar">
			<AppUpdateRequiredButton />
			<a href={location.linkToHome()} class="button">
				<img
					src={`${BASE_URL}/assets/logo.svg`}
					class="logo"
					alt="hello.nrfcloud.com logo"
				/>
			</a>
			<hr />
			<WarningButton />
			<SearchButton />
			<DeviceDetailButton />
			<AddDeviceButton />
			<ViewSourceButton />
		</nav>
	)
}
