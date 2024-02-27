import type { Resource } from '../../context/Navigation.jsx'
import { Favorite } from '../../icons/LucideIcon.jsx'
import { For, createMemo } from 'solid-js'
import {
	definitions,
	type LwM2MResourceInfo,
	type LwM2MObjectInstance,
	type LwM2MResourceValue,
} from '@hello.nrfcloud.com/proto-lwm2m'
import { isLwM2MObjectID } from '../../util/lwm2m.js'
import type { Device } from '../../context/Devices.jsx'
import { ResourcesDL } from '../ResourcesDL.jsx'
import { DescribeResource } from '../LwM2M.jsx'

import './DeviceInformation.css'

export const Icon = () => (
	<>
		<Favorite strokeWidth={1} size={24} />
		<small>Favorites</small>
	</>
)

export const Card = (props: { resources: Resource[]; device: Device }) => {
	const resourceValues = createMemo(() =>
		props.resources
			.map((resource) => {
				const { ObjectID, ResourceID } = resource
				if (!isLwM2MObjectID(ObjectID)) return undefined
				const definition = definitions[ObjectID].Resources[ResourceID]
				if (definition === undefined) return undefined
				const instance = props.device.state?.find(
					({ ObjectID: id }) => id === ObjectID,
				)
				if (instance === undefined) return undefined
				const resourceValue = instance?.Resources[ResourceID]
				if (resourceValue === undefined) return undefined
				return {
					instance: instance as LwM2MObjectInstance,
					resource,
					definition,
					value: resourceValue as LwM2MResourceValue,
				}
			})
			.filter(
				(
					s,
				): s is {
					instance: LwM2MObjectInstance
					resource: Resource
					definition: LwM2MResourceInfo
					value: LwM2MResourceValue
				} => s !== undefined,
			),
	)

	return (
		<ResourcesDL>
			<For each={resourceValues()}>
				{(resource) => (
					<DescribeResource
						device={props.device}
						instance={resource.instance}
						info={resource.definition}
						value={resource.value}
					/>
				)}
			</For>
		</ResourcesDL>
	)
}
