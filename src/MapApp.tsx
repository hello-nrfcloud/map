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
import { TutorialHighlight } from './component/Tutorial/TutorialHighlight.tsx'
import { createEffect } from 'solid-js'

import './Layout.css'

export const MapApp = () => {
	createEffect(() => {
		// In mobile browsers 100vh doesn't take into account the address bar.
		// However, this app's sidebar should not overflow the viewport.
		const appHeight = `${window.innerHeight}px`
		document.documentElement.style.setProperty('--app-height', appHeight)
		console.debug(`[MapApp]`, 'appHeight:', appHeight)
	})
	return (
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
}
