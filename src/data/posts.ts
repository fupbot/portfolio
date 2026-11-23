export interface Post {
  slug: string
  title: string
  date: string
  abstract: string
  tags: string[]
  readingMinutes: number
  html: string
}

// Shape produced by vite-plugin-posts.ts for each `?post` import.
type RawPost = Omit<Post, 'slug' | 'title'> & { title?: string; draft: boolean }

// Every Markdown file in src/posts/ is a post; the file name is its slug.
// The `?post` query hands the file to vite-plugin-posts.ts, which parses the
// frontmatter and renders + syntax-highlights the Markdown at build time.
const files = import.meta.glob('../posts/*.md', {
  query: '?post',
  import: 'default',
  eager: true,
}) as Record<string, RawPost>

export const posts: Post[] = Object.entries(files)
  .map(([file, { draft, ...post }]) => {
    const slug = file.split('/').pop()!.replace(/\.md$/, '')
    return { draft, post: { ...post, slug, title: post.title ?? slug } }
  })
  // Drafts are visible in `npm run dev` only.
  .filter(({ draft }) => import.meta.env.DEV || !draft)
  .map(({ post }) => post)
  .sort((a, b) => b.date.localeCompare(a.date))

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug)
}

// Chronological neighbours of a post (posts are sorted newest first).
export function getAdjacentPosts(slug: string): { newer?: Post; older?: Post } {
  const i = posts.findIndex((post) => post.slug === slug)
  if (i < 0) return {}
  return { newer: posts[i - 1], older: posts[i + 1] }
}

export function postPath(slug: string): string {
  return `/blog/${slug}/`
}

// Returns the post slug for a path like /blog/<slug>/ (trailing slash optional).
export function slugFromPath(path: string): string | undefined {
  return path.match(/^\/blog\/([^/]+)\/?$/)?.[1]
}
