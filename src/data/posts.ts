import { marked } from 'marked'

export interface Post {
  slug: string
  title: string
  date: string
  abstract: string
  html: string
}

// Every Markdown file in src/posts/ is a post; the file name is its slug.
const files = import.meta.glob('../posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

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

export const posts: Post[] = Object.entries(files)
  .map(([file, raw]) => {
    const slug = file.split('/').pop()!.replace(/\.md$/, '')
    const { meta, body } = parseFrontmatter(raw)
    return {
      slug,
      title: meta.title ?? slug,
      date: meta.date ?? '',
      abstract: meta.abstract ?? '',
      draft: meta.draft === 'true',
      html: marked.parse(body, { async: false }),
    }
  })
  // Drafts are visible in `npm run dev` only.
  .filter((post) => import.meta.env.DEV || !post.draft)
  .sort((a, b) => b.date.localeCompare(a.date))
  .map(({ slug, title, date, abstract, html }) => ({ slug, title, date, abstract, html }))

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

export function postPath(slug: string): string {
  return `/blog/${slug}/`
}

// Returns the post slug for a path like /blog/<slug>/ (trailing slash optional).
export function slugFromPath(path: string): string | undefined {
  return path.match(/^\/blog\/([^/]+)\/?$/)?.[1]
}
