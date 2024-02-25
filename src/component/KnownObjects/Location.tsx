import { Center, Map, ZoomIn } from '../../icons/LucideIcon.jsx'
import { type Geolocation_14201 } from '@hello.nrfcloud.com/proto-lwm2m'
import { createEffect, onCleanup } from 'solid-js'
import { Map as MapLibreGlMap, LngLatBounds } from 'maplibre-gl'
import { mapStyle } from '../../map/style.js'
import { useParameters } from '../../context/Parameters.jsx'
import { transformRequest } from '../../map/transformRequest.jsx'
import {
	geoJSONPolygonFromCircle,
	getPolygonCoordinatesForCircle,
} from '../../map/geoJSONPolygonFromCircle.js'
import { ZoomOut } from '../../icons/LucideIcon.js'

import './Location.css'

export const Icon = () => (
	<>
		<Map strokeWidth={1} size={24} />
		<small>Location</small>
	</>
)

const getLocationsBounds = (locations: Geolocation_14201[]) => {
	const coordinates = locations
		.map(({ Resources }) => {
			const lng = Resources[1]
			const lat = Resources[0]
			const acc = Resources[3] ?? 500
			return getPolygonCoordinatesForCircle([lng, lat], acc, 6, Math.PI / 2)
		})
		.flat()
	return coordinates.reduce(
		(bounds, coord) => {
			return bounds.extend(coord)
		},
		new LngLatBounds(coordinates[0], coordinates[0]),
	)
}

// FIXME: parse JSON dates
const byAge = (loc1: Geolocation_14201, loc2: Geolocation_14201) =>
	new Date(loc2.Resources['99']).getTime() -
	new Date(loc1.Resources['99']).getTime()

export const Card = ({ locations }: { locations: Geolocation_14201[] }) => {
	const parameters = useParameters()

	let ref!: HTMLDivElement
	let map: MapLibreGlMap

	const bounds = getLocationsBounds(locations)

	createEffect(() => {
		const mostRecent = locations.sort(byAge)[0] as Geolocation_14201

		const lng = mostRecent.Resources[1]
		const lat = mostRecent.Resources[0]

		map = new MapLibreGlMap({
			container: ref,
			style: mapStyle({
				region: parameters.mapRegion,
				mapName: parameters.mapName,
			}),
			center: [lng, lat],
			zoom: 4,
			refreshExpiredTiles: false,
			trackResize: false,
			keyboard: false,
			renderWorldCopies: false,
			transformRequest: transformRequest(
				parameters.mapApiKey,
				parameters.mapRegion,
			),
			attributionControl: false,
		})
		map.dragRotate.disable()
		map.scrollZoom.disable()
		map.dragPan.disable()

		map.on('load', () => {
			for (const { Resources } of locations) {
				const lng = Resources[1]
				const lat = Resources[0]
				const acc = Resources[3] ?? 500
				const src = Resources[6]
				// Data for Hexagon
				map.addSource(
					`center-circle-source-${src}`,
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
			}

			map.fitBounds(bounds, {
				padding: 20,
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
						map?.fitBounds(bounds, {
							padding: 20,
						})
					}
				>
					<Center />
				</button>
				<button type="button" onClick={() => map?.zoomOut()}>
					<ZoomOut />
				</button>
			</nav>
			<div class="map" ref={ref} />
		</div>
	)
}

// Source: https://coolors.co/palette/22577a-38a3a5-57cc99-80ed99-c7f9cc
const locationSourceColors: Record<string, string> = {
	['GNSS']: '#C7F9CC',
	['WIFI']: '#80ed99',
	['MCELL']: '#57cc99',
	['SCELL']: '#38a3a5',
} as const
const defaultLocationSourceColor = '#22577A'
