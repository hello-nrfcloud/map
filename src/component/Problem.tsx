import { type ParentProps } from 'solid-js'
import { Warning } from '../icons/LucideIcon.tsx'
import { ProblemDetail } from '@hello.nrfcloud.com/proto/hello'
import type { Static } from '@sinclair/typebox'
import './Problem.css'

export const Problem = (
	props: ParentProps<{
		problem: Omit<Static<typeof ProblemDetail>, '@context'>
	}>,
) => (
	<aside class="problem">
		<h1>
			<Warning /> A problem occurred!
		</h1>
		<p>{props.problem.title}</p>
	</aside>
)
