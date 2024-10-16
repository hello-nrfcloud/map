import { APIHealth } from '#component/APIHealth.js'
import {
	SidebarButton as AddDeviceButton,
	Sidebar as AddDeviceSidebar,
} from '#component/AddDevice.js'
import { AllDevicesMap } from '#component/AllDevicesMap/AllDevicesMap.js'
import { UpdateAvailable } from '#component/AppUpdate.js'
import { SidebarButton as DashboardButton } from '#component/Dashboard.js'
import {
	SidebarButton as DeviceDetailButton,
	DeviceSidebar,
} from '#component/Device.js'
import {
	SidebarButton as FeedbackButton,
	Sidebar as FeedbackSidebar,
} from '#component/Feedback.js'
import { NordicHeader } from '#component/NordicHeader.jsx'
import { Sidebar as SearchSidebar } from '#component/Search.js'
import { SearchButton } from '#component/Sidebar/SearchButton.js'
import { SidebarNav } from '#component/SidebarNav.js'
import {
	Tutorial,
	SidebarButton as TutorialButton,
} from '#component/Tutorial/Tutorial.js'
import {
	SidebarButton as ViewSourceButton,
	Sidebar as ViewSourceSidebar,
} from '#component/ViewSource.js'
import { createEffect } from 'solid-js'

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
