import {
	LwM2MObjectID,
	type Geolocation_14201,
	definitions,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { isLwM2MObjectID } from '@hello.nrfcloud.com/proto-lwm2m'
import {
	Map as MapLibreGlMap,
	MapMouseEvent,
	type MapGeoJSONFeature,
} from 'maplibre-gl'
import { onCleanup, createMemo, createSignal, createEffect } from 'solid-js'
import { useDevices } from '../../context/Devices.js'
import { type Device } from '../../resources/fetchDevices.js'
import { useParameters } from '../../context/Parameters.js'
import { createMap } from '../../map/createMap.js'
import { newestInstanceFirst } from '../../util/newestInstanceFirst.js'
import { matches, type SearchTerm } from '../../context/Search.js'
import { useNavigation, type Resource } from '../../context/Navigation.js'
import { glyphFonts } from '../../map/glyphFonts.js'
import { format, type ResourceValue } from '../../util/lwm2m.js'
import { createStore, reconcile } from 'solid-js/store'

import './AllDevicesMap.css'
import { useAllDevicesMapState } from '../../context/AllDeviceMapState.jsx'

type DeviceInfo = {
	device: Device
	location: Geolocation_14201
	resources: Array<ResourceValue>
}

export const AllDevicesMap = () => {
	const parameters = useParameters()
	const allDevices = useDevices()
	const location = useNavigation()
	const { initial, update, state } = useAllDevicesMapState()
	let ref!: HTMLDivElement
	let map: MapLibreGlMap

	// Use a store, so the devices only get updated in case the search really changes
	const [searchConfig, setSearchConfig] = createStore<{
		search: SearchTerm[]
		resources: Resource[]
	}>({
		search: location.current().search,
		resources: location.current().resources,
	})

	createEffect(() => {
		setSearchConfig('search', reconcile(location.current().search))
		setSearchConfig('resources', reconcile(location.current().resources))
	})

	const matchedDevices = createMemo(() => {
		console.log('[World]', 'update devices')
		return allDevices().filter(matches(searchConfig.search))
	})
	const [mapLoaded, setMapLoaded] = createSignal<boolean>(false)

	const updateNavigationMapState = (map: MapLibreGlMap) => {
		const zoom = map.getZoom()
		const center = map.getCenter()
		update({
			center,
			zoom,
		})
	}

	// FIXME: decide what should be used as the "center" of the device
	const deviceLocations = createMemo(() => {
		console.log('[World]', `update location`)
		return matchedDevices()
			.map<DeviceInfo | undefined>((device) => {
				const newestLocation = (device.state ?? [])
					.filter((state) => state.ObjectID === LwM2MObjectID.Geolocation_14201)
					.sort(newestInstanceFirst)[0]
				if (newestLocation === undefined) return undefined
				return {
					device,
					location: {
						...newestLocation,
						Resources: {
							...newestLocation?.Resources,
							99: new Date(newestLocation.Resources[99] as string),
						},
					} as Geolocation_14201,
					resources: searchConfig.resources
						.map(({ ObjectID, ResourceID }) => {
							if (!isLwM2MObjectID(ObjectID)) return undefined
							const info = definitions[ObjectID].Resources[ResourceID]
							if (info === undefined) return undefined
							const resourceValue = device.state?.find(
								({ ObjectID: id }) => id === ObjectID,
							)?.Resources[ResourceID]
							if (resourceValue === undefined) return undefined
							return format(resourceValue, info)
						})
						.filter((s): s is ResourceValue => s !== undefined),
				}
			})
			.filter((dl): dl is DeviceInfo => dl !== undefined)
	})

	// Create the initial map
	createEffect(() => {
		map = createMap(ref, parameters, initial.center, {
			zoom: initial.zoom,
		})

		map.on('load', () => {
			setMapLoaded(true)
			map.on(
				'click',
				'devices-dots',
				(e: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
					const id = e.features?.[0]?.properties.id
					location.navigate({
						panel: `id:${id}`,
					})
				},
			)
			map.on('mouseenter', 'devices-dots', () => {
				map.getCanvas().style.cursor = 'pointer'
			})
			map.on('mouseleave', 'devices-dots', () => {
				map.getCanvas().style.cursor = ''
			})
		})

		map.on('zoomend', () => updateNavigationMapState(map))
		map.on('moveend', () => updateNavigationMapState(map))
	})

	// Render devices
	createEffect(() => {
		if (!mapLoaded()) return
		if (map.getSource('devices-source')) {
			map.removeLayer('devices-dots')
			map.removeLayer('devices-resources')
			map.removeSource('devices-source')
		}

		map.addSource('devices-source', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: deviceLocations().map(
					({
						device: { id },
						location: {
							Resources: { 0: lat, 1: lng },
						},
						resources,
					}) => ({
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: [lng, lat],
						},
						properties: {
							id,
							resourceValues: resources
								.map(({ value, units }) => `${value} ${units ?? ''}`)
								.join('\n'),
						},
					}),
				),
			},
		})

		map.addLayer({
			id: 'devices-dots',
			type: 'circle',
			source: 'devices-source',
			paint: {
				'circle-color': '#80ed99',
				'circle-radius': 10,
				'circle-stroke-width': 1,
				'circle-stroke-color': '#222222',
			},
		})

		// Make dots bigger when zoomed in
		map.setPaintProperty('devices-dots', 'circle-radius', [
			'interpolate',
			['linear'],
			['zoom'],
			6, // Zoom start
			2, // start size
			14, // Zoom end
			10, // end size
		])

		map.addLayer({
			id: 'devices-resources',
			type: 'symbol',
			source: 'devices-source',
			layout: {
				'text-field': ['get', 'resourceValues'],
				'text-variable-anchor': ['bottom'],
				'text-radial-offset': 1,
				'text-justify': 'auto',
				'text-font': [glyphFonts.bold],
				'text-size': 10,
			},
			paint: {
				'text-color': '#80ed99',
				'text-halo-color': '#222222',
				'text-halo-width': 1,
				'text-halo-blur': 1,
			},
		})

		// Make text bigger when zoomed in
		map.setLayoutProperty('devices-resources', 'text-size', [
			'interpolate',
			['linear'],
			['zoom'],
			6, // Zoom start
			10, // start size
			14, // Zoom end
			14, // end size
		])
		map.setLayoutProperty('devices-resources', 'text-radial-offset', [
			'interpolate',
			['linear'],
			['zoom'],
			6, // Zoom start
			0.5, // start size
			14, // Zoom end
			1.5, // end size
		])
	})

	// Navigate if triggered from an in-app link
	createEffect(() => {
		if (state().apply !== true) return
		if (!mapLoaded()) return
		map.flyTo({
			center: state().center,
			zoom: state().zoom,
		})
	})

	onCleanup(() => {
		setMapLoaded(false)
		map?.remove()
	})

	return <div ref={ref} id="alldevices"></div>
}
