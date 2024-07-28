import { APIHealth } from './component/APIHealth.tsx'
import { Sidebar as AddDeviceSidebar } from './component/AddDevice.js'
import { AllDevicesMap } from './component/AllDevicesMap/AllDevicesMap.js'
import { UpdateAvailable } from './component/AppUpdate.tsx'
import { DeviceSidebar } from './component/Device.js'
import { NordicHeader } from './component/NordicHeader.jsx'
import { Sidebar as SearchSidebar } from './component/Search.js'
import { SidebarNav } from './component/SidebarNav.tsx'
import { Tutorial } from './component/Tutorial/Tutorial.tsx'
import { Sidebar as ViewSourceSidebar } from './component/ViewSource.js'
import { WIPSidebar } from './component/WIPSidebar.tsx'

import './Layout.css'
import { TutorialHighlight } from './component/Tutorial/TutorialHighlight.tsx'

export const MapApp = () => (
	<div id="layout">
		<APIHealth />
		<UpdateAvailable />
		<NordicHeader />
		<SidebarNav />
		<div id="sidebar">
			<Tutorial />
			<WIPSidebar />
			<DeviceSidebar />
			<SearchSidebar />
			<ViewSourceSidebar />
			<AddDeviceSidebar />
		</div>
		<AllDevicesMap />
		<TutorialHighlight />
	</div>
)
