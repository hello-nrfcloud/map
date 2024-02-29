export const addMinutes = (d: Date, minutes: number): Date =>
	new Date(d.getTime() + minutes * 60 * 1000)

export const subMinutes = (d: Date, minutes: number): Date =>
	addMinutes(d, -minutes)
