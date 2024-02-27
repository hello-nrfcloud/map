import {
	type LwM2MObjectInstance,
	type DeviceInformation_14204,
	type BatteryAndPower_14202,
	type Geolocation_14201,
	LwM2MObjectID,
	LwM2MObjectIDs,
	type LwM2MResourceValue,
	type LwM2MResourceInfo,
	ResourceType,
} from '@hello.nrfcloud.com/proto-lwm2m'

export const isDeviceInformation = (
	instance?: LwM2MObjectInstance,
): instance is DeviceInformation_14204 =>
	instance !== undefined &&
	instance.ObjectID === LwM2MObjectID.DeviceInformation_14204

export const isBatteryAndPower = (
	instance?: LwM2MObjectInstance,
): instance is BatteryAndPower_14202 =>
	instance !== undefined &&
	instance.ObjectID === LwM2MObjectID.BatteryAndPower_14202

export const isGeoLocation = (
	instance?: LwM2MObjectInstance,
): instance is Geolocation_14201 =>
	instance !== undefined &&
	instance.ObjectID === LwM2MObjectID.Geolocation_14201

export const isGeoLocationArray = (
	instances: LwM2MObjectInstance[],
): instances is Array<Geolocation_14201> =>
	Array.isArray(instances) &&
	instances.reduce(
		(allMatch, instance) => (!allMatch ? false : isGeoLocation(instance)),
		true,
	)

export const isLwM2MObjectID = (n: number): n is LwM2MObjectID =>
	LwM2MObjectIDs.includes(n)

export type ResourceValue = { value: string; units: string | undefined }
export const format = (
	value: LwM2MResourceValue,
	info: LwM2MResourceInfo,
): ResourceValue => {
	if (info.Type === ResourceType.Float && typeof value === 'number')
		return { value: value.toFixed(2).replace(/\.00$/, ''), units: info.Units }
	return { value: value.toString(), units: info.Units }
}
