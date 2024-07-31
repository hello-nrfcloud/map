import { APIHealth } from './component/APIHealth.js'
import { Sidebar as AddDeviceSidebar } from './component/AddDevice.js'
import { AllDevicesMap } from './component/AllDevicesMap/AllDevicesMap.js'
import { UpdateAvailable } from './component/AppUpdate.js'
import { DeviceSidebar } from './component/Device.js'
import { NordicHeader } from './component/NordicHeader.jsx'
import { Sidebar as SearchSidebar } from './component/Search.js'
import { SidebarNav } from './component/SidebarNav.js'
import { Tutorial } from './component/Tutorial/Tutorial.js'
import { Sidebar as ViewSourceSidebar } from './component/ViewSource.js'
import { Sidebar as FeedbackSidebar } from './component/Feedback.js'
import { Sidebar as ProtocolSidebar } from './component/Protocol.js'
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
				<DeviceSidebar />
				<SearchSidebar />
				<ViewSourceSidebar />
				<AddDeviceSidebar />
				<FeedbackSidebar />
				<ProtocolSidebar />
			</div>
			<AllDevicesMap />
		</div>
	)
}
