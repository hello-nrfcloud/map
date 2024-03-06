import { CopyToClipboard, CopiedToClipboard } from '../icons/LucideIcon.jsx'
import { Show, createSignal, createEffect, onCleanup } from 'solid-js'

export const CopyToClipboardButton = (props: { value: string }) => {
	const [copied, setCopied] = createSignal<number>(0)
	const [notify, setNotify] = createSignal<boolean>(false)

	createEffect(() => {
		setNotify(Date.now() - copied() < 1000)
		const t = setTimeout(() => {
			setNotify(false)
		}, 1000)
		onCleanup(() => {
			clearTimeout(t)
		})
	})

	return (
		<button
			type="button"
			onClick={() => {
				navigator.clipboard
					.writeText(props.value)
					.then(() => {
						setCopied(Date.now())
					})
					.catch(console.error)
			}}
		>
			<Show
				when={notify()}
				fallback={
					<>
						<CopyToClipboard strokeWidth={1} size={16} />
						<span>Copy</span>
					</>
				}
			>
				<CopiedToClipboard strokeWidth={1} size={16} />
				<span>Copied!</span>
			</Show>
		</button>
	)
}
