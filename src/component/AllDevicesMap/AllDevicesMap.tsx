import {
	LwM2MObjectID,
	type Geolocation_14201,
} from '@hello.nrfcloud.com/proto-lwm2m'
import {
	Map as MapLibreGlMap,
	MapMouseEvent,
	type MapGeoJSONFeature,
} from 'maplibre-gl'
import { createEffect, onCleanup } from 'solid-js'
import { useDevices, type Device } from '../../context/Devices.js'
import { useParameters } from '../../context/Parameters.js'
import { createMap } from '../../map/createMap.js'
import { newestInstanceFirst } from '../../util/instanceTs.js'

import './AllDevicesMap.css'

export const AllDevicesMap = () => {
	const parameters = useParameters()
	const devices = useDevices()
	let ref!: HTMLDivElement
	let map: MapLibreGlMap

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
			// FIXME: decide what should be used as the "center" of the device
			const deviceLocations = devices()
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
				)

			map.addSource('devices-source', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: deviceLocations.map(
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

			map.on(
				'click',
				'devices-layer',
				(e: MapMouseEvent & { features?: MapGeoJSONFeature[] }) => {
					const id = e.features?.[0]?.properties.id
					document.location.hash = `id:${id}`
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

	onCleanup(() => {
		map?.remove()
	})

	return <div ref={ref} id="alldevices"></div>
}
