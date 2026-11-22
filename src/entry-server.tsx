import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import { getPost, postPath, posts, slugFromPath } from './data/posts'

// Used at build time only (see scripts/prerender.mjs) to bake each route's HTML
// into its own index.html so crawlers and link previews see real content.

export const SITE_URL = 'https://fabiougalde.com'

export const routes = ['/', ...posts.map((post) => postPath(post.slug))]

export function render(path: string) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  )
}

// Per-route <head> values; undefined means "keep the template's default".
export function getMeta(path: string) {
  const slug = slugFromPath(path)
  const post = slug ? getPost(slug) : undefined
  if (!post) return { canonical: `${SITE_URL}/` }
  return {
    canonical: `${SITE_URL}${postPath(post.slug)}`,
    title: `${post.title} — Fabio Ugalde`,
    description: post.abstract || undefined,
  }
}
