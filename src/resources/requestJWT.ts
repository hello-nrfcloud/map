import { ProblemDetailError } from '#component/notifications/Problem.tsx'
import { UserJWT } from '@hello.nrfcloud.com/proto-map/api'
import { typedFetch } from '@hello.nrfcloud.com/proto/hello'

export const requestJWT =
	(apiURL: URL) =>
	async ({
		email,
		token,
	}: {
		email: string
		token: string
	}): Promise<string> => {
		const res = await typedFetch({
			responseBodySchema: UserJWT,
		})(new URL('./auth/jwt', apiURL), { email, token }, { method: 'POST' })
		if ('error' in res) {
			console.error(res.error)
			throw new ProblemDetailError(res.error)
		}
		return res.result.jwt
	}
