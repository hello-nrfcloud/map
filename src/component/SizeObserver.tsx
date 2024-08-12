import { createEffect, createSignal, onCleanup, Show, type JSX } from 'solid-js'

export type Size = { width: number; height: number }
export const SizeObserver = (props: {
	class?: string
	children: (size: Size) => JSX.Element
}) => {
	let ref!: HTMLDivElement
	const [size, setSize] = createSignal<[number, number]>()

	const resizeObserver = new ResizeObserver((entries) => {
		entries.forEach((entry) => {
			const { target, contentRect } = entry
			const { width, height } = contentRect
			setSize([width, height])

			console.debug(
				`[SizeObserver]`,
				`Element resized: width: ${width}, height: ${height}`,
				target,
			)

			resizeObserver.unobserve(ref)
		})
	})

	createEffect(() => {
		if (ref === undefined) return

		resizeObserver.observe(ref)

		onCleanup(() => {
			resizeObserver.unobserve(ref)
		})
	})

	return (
		<div ref={ref} class={`size-observer ${props.class ?? ''}`}>
			<Show when={size() !== undefined}>
				{props.children({ width: size()![0], height: size()![1] })}
			</Show>
		</div>
	)
}
