import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'
import { getPost, postPath, posts, slugFromPath } from './data/posts'

// Used at build time only (see scripts/prerender.mjs) to bake each route's HTML
// into its own index.html so crawlers and link previews see real content.

export const SITE_URL = 'https://fabiougalde.com'

export const SITE_TITLE = 'Fabio Ugalde'

export const routes = ['/', ...posts.map((post) => postPath(post.slug))]

// Published posts, newest first; used for the RSS feed and sitemap dates.
export const feedPosts = posts.map((post) => ({
  url: `${SITE_URL}${postPath(post.slug)}`,
  title: post.title,
  date: post.date,
  abstract: post.abstract,
  tags: post.tags,
  html: post.html,
}))

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
  const url = `${SITE_URL}${postPath(post.slug)}`
  return {
    canonical: url,
    title: `${post.title} — ${SITE_TITLE}`,
    description: post.abstract || undefined,
    article: {
      publishedTime: post.date || undefined,
      tags: post.tags,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.abstract || undefined,
        datePublished: post.date || undefined,
        keywords: post.tags.length ? post.tags.join(', ') : undefined,
        url,
        mainEntityOfPage: url,
        author: { '@type': 'Person', name: SITE_TITLE, url: `${SITE_URL}/` },
      },
    },
  }
}
