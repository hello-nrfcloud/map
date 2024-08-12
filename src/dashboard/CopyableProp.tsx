import { CopyToClipboardButton } from '#dashboard/CopyToClipboardButton.js'

export const CopyableProp = (props: {
	name: string
	value: string
	['data-testId']?: string
}) => (
	<>
		<dt>
			<span>{props.name}</span>
			<CopyToClipboardButton value={props.value} />
		</dt>
		<dd>
			<pre data-testId={props['data-testId']}>{props.value}</pre>
		</dd>
	</>
)
