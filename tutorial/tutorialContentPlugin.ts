import type { Plugin } from 'vite'
import fs from 'node:fs/promises'
import path from 'node:path'
import { loadMarkdownContentFromFile } from './loadMarkdownFromFile.ts'
import { Type, type Static } from '@sinclair/typebox'
import { validateWithTypeBox } from '@hello.nrfcloud.com/proto'
import { decode } from '../src/context/navigation/encodeNavigation.ts'

const __dirname = import.meta.dirname
const tutorialDir = path.join(__dirname, '..', 'docs', 'tutorial')

export const TutorialEntry = Type.Object({
	id: Type.String({ minLength: 1 }),
	html: Type.String({ minLength: 1 }),
	next: Type.Optional(
		Type.String({
			minLength: 1,
			title: 'Next',
			description: 'ID of the next tutorial',
		}),
	),
	done: Type.Optional(
		Type.String({
			minLength: 1,
			title: 'Location Match',
			description:
				'Marks the current tutorial as done when the location contains this string',
		}),
	),
	highlight: Type.Optional(
		Type.String({
			minLength: 1,
			title: 'Highlight',
			description:
				'CSS selector targeting an element that should be highlighted',
		}),
	),
})

const validate = validateWithTypeBox(TutorialEntry)

export type TutorialEntryType = Static<typeof TutorialEntry> & {
	prev?: string
}

export type TutorialContent = Record<string, TutorialEntryType> & {
	start: TutorialEntryType
}

export const tutorialContentPlugin = (): Plugin => {
	const virtualModuleId = 'map:tutorial-content'
	const resolvedVirtualModuleId = '\0' + virtualModuleId

	return {
		name: 'tutorial-content', // required, will show up in warnings and errors
		resolveId: (id) => {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId
			}
			return undefined
		},
		load: async (id) => {
			if (id === resolvedVirtualModuleId) {
				const files = await Promise.all(
					(await fs.readdir(tutorialDir))
						.filter((f) => f.endsWith('.md'))
						.map(async (f) =>
							loadMarkdownContentFromFile(path.join(tutorialDir, f)),
						),
				)

				const content = {} as TutorialContent

				for (const file of files) {
					const maybeValid = validate(file)
					if ('errors' in maybeValid)
						throw new Error(
							`Invalid content in ${file.id}: ${JSON.stringify(maybeValid.errors)}`,
						)
					console.debug(`[Tutorial]`, file.id, 'loaded')
					content[file.id] = maybeValid.value
				}

				// Make sure start exists
				if (content.start === undefined) {
					throw new Error(`[Tutorial] 'start' tutorial not found`)
				}

				// Make sure links work
				for (const file of files) {
					if (file.next === undefined) continue
					const next = content[file.next]
					if (next === undefined) {
						throw new Error(
							`[Tutorial:next] '${file.id}' references non-existent tutorial '${file.next}'`,
						)
					}
					console.debug(`[Tutorial]`, `(next)`, file.id, '🡒', file.next)
					// Set prev
					next.prev = file.id
				}

				// Make sure locationMatch can be parsed
				for (const file of files) {
					if (file.done === undefined) continue
					if (decode(file.done) === undefined) {
						throw new Error(
							`[Tutorial:done] '${file.id}' has invalid locationMatch '${file.done}'`,
						)
					}
				}

				return `export const content = ${JSON.stringify(content)}`
			}
			return undefined
		},
	}
}
