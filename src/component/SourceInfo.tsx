import { type ParentProps } from 'solid-js'
import './SourceInfo.css'

export const SourceInfo = (props: ParentProps) => (
	<div class="source-info">{props.children}</div>
)
