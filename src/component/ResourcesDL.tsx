import { type ParentProps } from 'solid-js'
import './ResourcesDL.css'

export const ResourcesDL = (props: ParentProps) => (
	<dl class="resources">{props.children}</dl>
)
