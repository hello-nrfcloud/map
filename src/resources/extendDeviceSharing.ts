import { ProblemDetailError } from '#component/notifications/Problem.tsx'
import { typedFetch } from '@hello.nrfcloud.com/proto/hello'
import { Type } from '@sinclair/typebox'

export const extendDeviceSharing =
	(apiURL: URL) =>
	async ({ id, jwt }: { id: string; jwt: string }): Promise<void> => {
		const res = await typedFetch({
			responseBodySchema: Type.Undefined(),
		})(new URL(`./user/device/${id}/sharing`, apiURL), undefined, {
			method: 'PUT',
			headers: { Authorization: `Bearer ${jwt}` },
		})
		if ('error' in res) {
			console.error(res.error)
			throw new ProblemDetailError(res.error)
		}
		return res.result
	}
