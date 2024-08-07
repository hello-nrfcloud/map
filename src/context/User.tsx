import type { UserJWTPayload } from '@hello.nrfcloud.com/proto-map/api'
import type { Static } from '@sinclair/typebox'
import {
	type Accessor,
	createContext,
	createSignal,
	type ParentProps,
	useContext,
	createEffect,
} from 'solid-js'

const key = 'user:jwt'

export const UserProvider = (props: ParentProps) => {
	const [user, setUser] = createSignal<
		Static<typeof UserJWTPayload> | undefined
	>()
	const [jwt, setUserJWT] = createSignal<string | undefined>(
		localStorage.getItem(key) ?? undefined,
	)

	createEffect(() => {
		if (jwt() !== undefined) {
			try {
				const payload = JSON.parse(atob(jwt()!.split('.')?.[1] ?? ''))
				if (payload.exp < Date.now() / 1000) throw new Error('JWT expired')
				setUser(payload)
				localStorage.setItem(key, jwt()!)
			} catch (e) {
				console.error(
					`[UserProvider] Failed to parse JWT: ${(e as Error).message}`,
				)
				localStorage.removeItem(key)
				setUserJWT(undefined)
			}
		}
	})

	return (
		<UserContext.Provider
			value={{
				user,
				setUserJWT,
				logout: () => {
					setUser(undefined)
					setUserJWT(undefined)
					localStorage.removeItem(key)
				},
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
}>({
	setUserJWT: () => undefined,
	user: () => undefined,
	logout: () => undefined,
})

export const useUser = () => useContext(UserContext)
