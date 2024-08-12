import { ProblemDetailError } from '#component/notifications/Problem.tsx'
import { UserDevices } from '@hello.nrfcloud.com/proto-map/api'
import { typedFetch } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'

export const listUserDevices =
	(apiURL: URL) =>
	async (jwt: string): Promise<Static<typeof UserDevices>> => {
		const res = await typedFetch({
			responseBodySchema: UserDevices,
		})(new URL('./user/devices', apiURL), undefined, {
			headers: {
				Authorization: `Bearer ${jwt}`,
			},
		})
		if ('error' in res) {
			console.error(res.error)
			throw new ProblemDetailError(res.error)
		}
		return res.result
	}
