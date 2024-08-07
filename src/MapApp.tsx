import { APIHealth } from '#component/APIHealth.js'
import { AllDevicesMap } from '#component/AllDevicesMap/AllDevicesMap.js'
import { UpdateAvailable } from '#component/AppUpdate.js'
import { DeviceSidebar } from '#component/Device.js'
import { NordicHeader } from '#component/NordicHeader.jsx'
import { Sidebar as SearchSidebar } from '#component/Search.js'
import { SidebarNav } from '#component/SidebarNav.js'
import { Tutorial } from '#component/Tutorial/Tutorial.js'
import { Sidebar as ViewSourceSidebar } from '#component/ViewSource.js'
import { Sidebar as FeedbackSidebar } from '#component/Feedback.js'
import { createEffect } from 'solid-js'
import { SidebarButton as DeviceDetailButton } from '#component/Device.js'
import { SidebarButton as ViewSourceButton } from '#component/ViewSource.js'
import { SearchButton } from '#component/Sidebar/SearchButton.js'
import { SidebarButton as TutorialButton } from '#component/Tutorial/Tutorial.js'
import { SidebarButton as FeedbackButton } from '#component/Feedback.js'
import { SidebarButton as DashboardButton } from '#component/Dashboard.js'
import {
	SidebarButton as AddDeviceButton,
	Sidebar as AddDeviceSidebar,
} from '#component/AddDevice.js'

import './MapApp.css'

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
			<SidebarNav>
				<TutorialButton />
				<SearchButton />
				<DeviceDetailButton />
				<AddDeviceButton />
				<FeedbackButton />
				<DashboardButton />
				<ViewSourceButton />
			</SidebarNav>
			<div id="sidebar">
				<Tutorial />
				<DeviceSidebar />
				<SearchSidebar />
				<ViewSourceSidebar />
				<FeedbackSidebar />
				<AddDeviceSidebar />
			</div>
			<AllDevicesMap />
		</div>
	)
}
