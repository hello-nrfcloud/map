import { APIHealth } from '#component/APIHealth.tsx'
import {
	SidebarButton as AddDeviceButton,
	Sidebar as AddDeviceSidebar,
} from '#component/AddDevice.tsx'
import { AllDevicesMap } from '#component/AllDevicesMap/AllDevicesMap.tsx'
import { UpdateAvailable } from '#component/AppUpdate.tsx'
import { SidebarButton as DashboardButton } from '#component/Dashboard.tsx'
import {
	SidebarButton as DeviceDetailButton,
	DeviceSidebar,
} from '#component/Device.tsx'
import {
	SidebarButton as FeedbackButton,
	Sidebar as FeedbackSidebar,
} from '#component/Feedback.tsx'
import { NordicHeader } from '#component/NordicHeader.tsx'
import { Sidebar as SearchSidebar } from '#component/Search.tsx'
import { SearchButton } from '#component/Sidebar/SearchButton.tsx'
import { SidebarNav } from '#component/SidebarNav.tsx'
import {
	Tutorial,
	SidebarButton as TutorialButton,
} from '#component/Tutorial/Tutorial.tsx'
import {
	SidebarButton as ViewSourceButton,
	Sidebar as ViewSourceSidebar,
} from '#component/ViewSource.tsx'
import { createEffect } from 'solid-js'

import './MapApp.css'

export const MapApp = () => {
	createEffect(() => {
		// In mobile browsers 100vh doesn't take into account the address bar.
		// However, this app's sidebar should not overflow the viewport.
		const appHeight = `${window.innerHeight}px`
		document.documentElement.style.setProperty('--app-height', appHeight)
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
