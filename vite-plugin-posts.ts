// Turns `src/posts/*.md?post` imports into ready-to-use post objects at build
// time: frontmatter parsed, Markdown rendered to HTML, code blocks syntax-
// highlighted with Shiki. Neither `marked` nor Shiki ends up in the browser.
import { readFile } from 'node:fs/promises'
import { Marked, type Tokens } from 'marked'
import { bundledLanguages, createHighlighter, type BundledLanguage } from 'shiki'
import type { Plugin } from 'vite'

const THEME = 'github-dark-default'
const WORDS_PER_MINUTE = 200

// Minimal frontmatter: `key: value` lines between leading `---` markers.
function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { meta: {}, body: raw }
  const meta: Record<string, string> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const i = line.indexOf(':')
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim()
  }
  return { meta, body: match[2] }
}

const highlighterPromise = createHighlighter({ themes: [THEME], langs: [] })

async function renderMarkdown(body: string): Promise<string> {
  const highlighter = await highlighterPromise

  // Load every language used in this post before the (synchronous) render.
  const marked = new Marked()
  const langs = new Set<BundledLanguage>()
  marked.walkTokens(marked.lexer(body), (token) => {
    const lang = (token as Tokens.Code).lang?.split(/\s/)[0]
    if (token.type === 'code' && lang && lang in bundledLanguages) langs.add(lang as BundledLanguage)
  })
  await highlighter.loadLanguage(...langs)

  marked.use({
    renderer: {
      code({ text, lang }) {
        const language = lang?.split(/\s/)[0]
        return highlighter.codeToHtml(text, {
          lang: language && language in bundledLanguages ? language : 'text',
          theme: THEME,
        })
      },
    },
  })
  return marked.parse(body, { async: false })
}

export default function postsPlugin(): Plugin {
  return {
    name: 'posts',
    async load(id) {
      // In dev Vite may add other params (e.g. `?import&post`).
      const [file, query = ''] = id.split('?')
      if (!file.endsWith('.md') || !new URLSearchParams(query).has('post')) return

      const raw = await readFile(file, 'utf8')
      const { meta, body } = parseFrontmatter(raw)
      const words = body.split(/\s+/).filter(Boolean).length

      const post = {
        title: meta.title,
        date: meta.date ?? '',
        abstract: meta.abstract ?? '',
        tags: (meta.tags ?? '').split(',').map((t) => t.trim()).filter(Boolean),
        draft: meta.draft === 'true',
        readingMinutes: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
        html: await renderMarkdown(body),
      }
      return `export default ${JSON.stringify(post)}`
    },
  }
}
