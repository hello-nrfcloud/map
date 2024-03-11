import { CopyToClipboardButton } from './CopyToClipboardButton.js'

export const CopyableProp = (props: { name: string; value: string }) => (
	<>
		<dt>
			<span>{props.name}</span>
			<CopyToClipboardButton value={props.value} />
		</dt>
		<dd>
			<pre>{props.value}</pre>
		</dd>
	</>
)
