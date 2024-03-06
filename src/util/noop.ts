export const noop = (ev: SubmitEvent): void => {
	ev.preventDefault()
	ev.stopPropagation()
}
