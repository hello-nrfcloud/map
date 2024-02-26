import {
	LwM2MObjectID,
	type Geolocation_14201,
} from '@hello.nrfcloud.com/proto-lwm2m'
import {
	Map as MapLibreGlMap,
	MapMouseEvent,
	type MapGeoJSONFeature,
} from 'maplibre-gl'
import { createEffect, onCleanup, createMemo, createSignal } from 'solid-js'
import { useDevices, type Device } from '../../context/Devices.js'
import { useParameters } from '../../context/Parameters.js'
import { createMap } from '../../map/createMap.js'
import { newestInstanceFirst } from '../../util/instanceTs.js'
import { matches } from '../../context/Search.js'

import './AllDevicesMap.css'
import { useNavigation } from '../../context/Navigation.jsx'

export const AllDevicesMap = () => {
	const parameters = useParameters()
	const allDevices = useDevices()
	const location = useNavigation()
	let ref!: HTMLDivElement
	let map: MapLibreGlMap
	const devices = createMemo(() =>
		allDevices().filter(matches(location.current().search)),
	)
	const [mapLoaded, setMapLoaded] = createSignal<boolean>(false)

	// FIXME: decide what should be used as the "center" of the device
	const deviceLocations = createMemo(() =>
		devices()
			.map<{ device: Device; location: Geolocation_14201 } | undefined>(
				(device) => {
					const newestLocation = (device.state ?? [])
						.filter(
							(state) => state.ObjectID === LwM2MObjectID.Geolocation_14201,
						)
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
					}
				},
			)
			.filter(
				(dl): dl is { device: Device; location: Geolocation_14201 } =>
					dl !== undefined,
			),
	)

	createEffect(() => {
		map = createMap(
			ref,
			parameters,
			{
				lat: 63.421065865928355,
				lng: 10.437128259586967,
			},
			1,
		)

		map.on('load', () => {
			setMapLoaded(true)
			map.on(
				'click',
				'devices-layer',
				(e: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
					const id = e.features?.[0]?.properties.id
					location.navigate({
						panel: `id:${id}`,
					})
				},
			)
			map.on('mouseenter', 'devices-layer', () => {
				map.getCanvas().style.cursor = 'pointer'
			})
			map.on('mouseleave', 'devices-layer', () => {
				map.getCanvas().style.cursor = ''
			})
		})
	})

	createEffect(() => {
		if (!mapLoaded()) return
		if (map.getSource('devices-source')) {
			map.removeLayer('devices-layer')
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
					}) => ({
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: [lng, lat],
						},
						properties: {
							id,
						},
					}),
				),
			},
		})

		map.addLayer({
			id: 'devices-layer',
			type: 'circle',
			source: 'devices-source',
			paint: {
				'circle-color': '#80ed99',
				'circle-radius': 4,
				'circle-stroke-width': 1,
				'circle-stroke-color': '#2f5a87',
			},
		})
	})

	onCleanup(() => {
		setMapLoaded(false)
		map?.remove()
	})

	return <div ref={ref} id="alldevices"></div>
}
