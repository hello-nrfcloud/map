import { type ParentProps, Show } from 'solid-js'
import { Warning } from '../icons/LucideIcon.tsx'
import type {
	HttpStatusCode,
	ProblemDetail,
} from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import './Problem.css'

/**
 * Since resources cannot return errors, but must throw them instead, we need a way to encode errors in a way that can be passed to the UI.
 *
 * @see https://datatracker.ietf.org/doc/draft-ietf-httpapi-rfc7807bis/
 */
export class ProblemDetailError extends Error {
	public readonly type: string | undefined
	public readonly status: HttpStatusCode | undefined
	public readonly title: string
	public readonly detail: string | undefined
	constructor(detail: Static<typeof ProblemDetail>) {
		super(detail.title)
		this.name = 'ProblemDetailError'
		this.type = detail.type
		this.status = detail.status
		this.title = detail.title
		this.detail = detail.detail
	}
}

export const Problem = (
	props: ParentProps<{
		problem: Omit<Static<typeof ProblemDetail>, '@context'> | ProblemDetailError
	}>,
) => (
	<aside class="problem">
		<h1>
			<Warning /> A problem occurred!
		</h1>
		<p>
			{props.problem.title}{' '}
			<Show when={props.problem.status !== undefined}>
				(<code>{props.problem.status}</code>)
			</Show>
			<Show when={props.problem.detail !== undefined}>
				<br />
				<small>{props.problem.detail!}</small>
			</Show>
		</p>
	</aside>
)
