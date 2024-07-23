import { readFile } from 'node:fs/promises'
import { parse } from 'node:path'
import format from 'rehype-format'
import html from 'rehype-stringify'
import { remark } from 'remark'
import extract from 'remark-extract-frontmatter'
import frontmatter from 'remark-frontmatter'
import remark2rehype from 'remark-rehype'
import yaml from 'yaml'
import rehypeExternalLinks from 'rehype-external-links'

const parseMarkdown = remark()
	.use(frontmatter, ['yaml'])
	.use(extract, { yaml: yaml.parse })
	.use(remark2rehype)
	.use(rehypeExternalLinks, { rel: ['noopener noreferer'], target: '_blank' })
	.use(format)
	.use(html)

export type MarkdownContent = Record<string, any> & {
	id: string
	html: string
}

export const loadMarkdownContentFromFile = async (
	file: string,
): Promise<MarkdownContent> => {
	const source = await readFile(file, 'utf-8')
	const md = await parseMarkdown.process(source)

	return {
		...md.data,
		html: md.value,
		id: parse(file).name,
	} as MarkdownContent
}
