import { useNavigation } from '#context/Navigation.tsx'
import { useParameters } from '#context/Parameters.js'
import { Lock, Map, Unlock, ZoomIn, ZoomOut } from '#icons/LucideIcon.js'
import { createMap } from '#map/createMap.js'
import { geoJSONPolygonFromCircle } from '#map/geoJSONPolygonFromCircle.js'
import { getLocationsBounds } from '#map/getLocationsBounds.ts'
import { glyphFonts } from '#map/glyphFonts.js'
import {
	defaultLocationSourceColor,
	locationSourceColors,
} from '#map/locationSourceColors.js'
import { type Geolocation_14201 } from '@hello.nrfcloud.com/proto-map/lwm2m'
import type { Map as MapLibreGlMap } from 'maplibre-gl'
import { ScaleControl } from 'maplibre-gl'
import {
	createEffect,
	createMemo,
	createSignal,
	onCleanup,
	Show,
} from 'solid-js'

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
	const location = useNavigation()
	const [locked, setLocked] = createSignal(true)

	let ref!: HTMLDivElement
	let map: MapLibreGlMap

	const centerLocation = createMemo(() =>
		props.locations.find(
			({ Resources }) =>
				Resources[6] === location.current()?.deviceMap?.centerLocationSource,
		),
	)

	createEffect(() => {
		const mostRecent = props.locations.sort(byAge)[0]

		if (mostRecent === undefined) return

		const {
			Resources: { 0: lat, 1: lng },
		} = centerLocation() ?? mostRecent

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
				map.addSource(locationAreaSourceId, {
					...geoJSONPolygonFromCircle([lng, lat], acc, 6, Math.PI / 2),
					// This will ensure that the polygon is drawn even at low zoom levels
					// See https://docs.mapbox.com/help/troubleshooting/working-with-large-geojson-data/#tolerance
					tolerance: 0.001,
				})
				// Render Hexagon
				map.addLayer({
					id: `center-circle-layer-${src}`,
					type: 'line',
					source: locationAreaSourceId,
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
		})

		onCleanup(() => {
			map?.remove()
		})
	})

	createEffect(() => {
		if (centerLocation() === undefined) return
		map.fitBounds(getLocationsBounds([centerLocation()!]), {
			padding: 40,
			maxZoom: 16,
		})
	})

	createEffect(() => {
		if (locked()) {
			map.scrollZoom.disable()
			map.dragPan.disable()
		} else {
			map.scrollZoom.enable()
			map.dragPan.enable()
		}
	})

	return (
		<div class="map-container">
			<nav>
				<button type="button" onClick={() => map?.zoomIn()}>
					<ZoomIn />
				</button>
				<Show
					when={locked()}
					fallback={
						<button
							type="button"
							onClick={() => {
								setLocked(true)
							}}
						>
							<Lock />
						</button>
					}
				>
					<button
						type="button"
						onClick={() => {
							setLocked(false)
						}}
					>
						<Unlock />
					</button>
				</Show>
				<button type="button" onClick={() => map?.zoomOut()}>
					<ZoomOut />
				</button>
			</nav>
			<div class="map device-map" ref={ref} />
		</div>
	)
}
