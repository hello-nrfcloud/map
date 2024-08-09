import type { UserJWTPayload } from '@hello.nrfcloud.com/proto-map/api'
import type { Static } from '@sinclair/typebox'
import {
	type Accessor,
	createContext,
	createEffect,
	createSignal,
	onCleanup,
	type ParentProps,
	useContext,
} from 'solid-js'

const key = 'user:jwt'

const decodeJWT = (jwt: string): Record<string, any> | undefined => {
	try {
		return JSON.parse(atob(jwt.split('.')?.[1] ?? ''))
	} catch {
		return undefined
	}
}

export const UserProvider = (props: ParentProps) => {
	const [user, setUser] = createSignal<
		Static<typeof UserJWTPayload> | undefined
	>()
	const [jwt, setUserJWT] = createSignal<string | undefined>(
		localStorage.getItem(key) ?? undefined,
	)

	const logout = () => {
		setUser(undefined)
		setUserJWT(undefined)
		localStorage.removeItem(key)
	}

	createEffect(() => {
		if (jwt() === undefined) return

		try {
			const payload = decodeJWT(jwt()!)
			if (payload === undefined) throw new Error('Invalid JWT')
			if (payload.exp < Date.now() / 1000) throw new Error('JWT expired')
			setUser(payload as Static<typeof UserJWTPayload>)
			localStorage.setItem(key, jwt()!)
		} catch (e) {
			console.error(
				`[UserProvider] Failed to parse JWT: ${(e as Error).message}`,
			)
			logout()
		}
	})

	createEffect(() => {
		if (jwt() === undefined) return
		const exp = decodeJWT(jwt()!)?.exp
		if (exp === undefined) return
		const expiresInSeconds = exp - Date.now() / 1000
		console.debug(
			`[User] JWT expires in ${Math.floor(expiresInSeconds)} seconds`,
		)
		const timeout = setTimeout(logout, expiresInSeconds * 1000)
		onCleanup(() => clearTimeout(timeout))
	})

	return (
		<UserContext.Provider
			value={{
				user,
				setUserJWT,
				logout,
				jwt,
			}}
		>
			{props.children}
		</UserContext.Provider>
	)
}

export const UserContext = createContext<{
	setUserJWT: (jwt: string) => void
	user: Accessor<Static<typeof UserJWTPayload> | undefined>
	logout: () => void
	jwt: Accessor<string | undefined>
}>({
	setUserJWT: () => undefined,
	user: () => undefined,
	logout: () => undefined,
	jwt: () => undefined,
})

export const useUser = () => useContext(UserContext)
