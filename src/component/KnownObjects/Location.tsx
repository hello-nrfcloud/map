import { Center, Map, ZoomIn } from '../../icons/LucideIcon.jsx'
import { type Geolocation_14201 } from '@hello.nrfcloud.com/proto-lwm2m'
import { createEffect, onCleanup, createMemo } from 'solid-js'
import { Map as MapLibreGlMap, ScaleControl } from 'maplibre-gl'
import { useParameters } from '../../context/Parameters.jsx'
import { geoJSONPolygonFromCircle } from '../../map/geoJSONPolygonFromCircle.js'
import { ZoomOut } from '../../icons/LucideIcon.js'
import { getLocationsBounds } from '../../map/getLocationsBounds.js'
import { createMap } from '../../map/createMap.js'
import {
	locationSourceColors,
	defaultLocationSourceColor,
} from '../../map/locationSourceColors.js'
import { glyphFonts } from '../../map/glyphFonts.js'

import './Location.css'

export const Icon = () => (
	<>
		<Map strokeWidth={1} size={24} />
		<small>Location</small>
	</>
)

// FIXME: parse JSON dates
const byAge = (loc1: Geolocation_14201, loc2: Geolocation_14201) =>
	new Date(loc2.Resources['99']).getTime() -
	new Date(loc1.Resources['99']).getTime()

export const Card = (props: { locations: Geolocation_14201[] }) => {
	const parameters = useParameters()

	let ref!: HTMLDivElement
	let map: MapLibreGlMap

	const bounds = createMemo(() => getLocationsBounds(props.locations))

	createEffect(() => {
		const mostRecent = props.locations.sort(byAge)[0]

		if (mostRecent === undefined) return

		const {
			Resources: { 0: lat, 1: lng },
		} = mostRecent

		map = createMap(
			ref,
			parameters,
			{ lat, lng },
			{ zoom: 8, attributionControl: false },
		)
		map.scrollZoom.disable()
		map.dragPan.disable()
		map.addControl(
			new ScaleControl({
				maxWidth: 100,
				unit: 'metric',
			}),
		)

		map.on('load', () => {
			for (const { Resources } of props.locations) {
				const lng = Resources[1]
				const lat = Resources[0]
				const acc = Resources[3] ?? 500
				const src = Resources[6]
				// Data for Hexagon
				const locationAreaSourceId = `center-circle-source-${src}`
				map.addSource(
					locationAreaSourceId,
					geoJSONPolygonFromCircle([lng, lat], acc, 6, Math.PI / 2),
				)
				// Render Hexagon
				map.addLayer({
					id: `center-circle-layer-${src}`,
					type: 'line',
					source: `center-circle-source-${src}`,
					layout: {},
					paint: {
						'line-color':
							locationSourceColors[src] ?? defaultLocationSourceColor,
						'line-opacity': 1,
						'line-width': 2,
					},
				})
				// Render label on Hexagon
				map.addLayer({
					id: `center-circle-layer-label-${src}`,
					type: 'symbol',
					source: locationAreaSourceId,
					layout: {
						'symbol-placement': 'line',
						'text-field': `${src}${acc !== undefined ? ` (${Math.round(acc)} m)` : ''}`,
						'text-font': [glyphFonts.regular],
						'text-offset': [0, -1],
						'text-size': 14,
					},
					paint: {
						'text-color':
							locationSourceColors[src] ?? defaultLocationSourceColor,
						'text-halo-color': '#222222',
						'text-halo-width': 1,
						'text-halo-blur': 1,
					},
				})
			}

			map.fitBounds(bounds(), {
				padding: 20,
				maxZoom: 16,
			})
		})
	})

	onCleanup(() => {
		map?.remove()
	})

	return (
		<div class="map-container">
			<nav>
				<button type="button" onClick={() => map?.zoomIn()}>
					<ZoomIn />
				</button>
				<button
					type="button"
					onClick={() =>
						map?.fitBounds(bounds(), {
							padding: 20,
							maxZoom: 16,
						})
					}
				>
					<Center />
				</button>
				<button type="button" onClick={() => map?.zoomOut()}>
					<ZoomOut />
				</button>
			</nav>
			<div class="map device-map" ref={ref} />
		</div>
	)
}
