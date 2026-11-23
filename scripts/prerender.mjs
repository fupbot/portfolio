// Prerenders every route (home + one page per blog post) into dist/, writes
// dist/sitemap.xml and dist/rss.xml, then removes the temporary SSR bundle. Runs as the last
// step of `npm run build`.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ssrDir = path.join(root, 'dist-ssr')
const distDir = path.join(root, 'dist')
const indexPath = path.join(distDir, 'index.html')

const { render, routes, getMeta, feedPosts, SITE_URL, SITE_TITLE } = await import(
  pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
)

const placeholder = '<div id="root"></div>'
const template = await readFile(indexPath, 'utf8')
if (!template.includes(placeholder)) {
  throw new Error(`prerender: "${placeholder}" not found in dist/index.html`)
}

const escapeAttr = (s) =>
  s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Replaces the content="..." / href="..." of a tag matched by `selector`.
function setAttr(html, selector, attr, value) {
  const re = new RegExp(`(<[^>]*${selector}[^>]*\\s${attr}=")[^"]*(")`)
  if (!re.test(html)) throw new Error(`prerender: tag ${selector} not found in template`)
  return html.replace(re, `$1${escapeAttr(value)}$2`)
}

function applyMeta(html, { title, description, canonical, article }) {
  if (title) {
    html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(title)}</title>`)
    html = setAttr(html, 'property="og:title"', 'content', title)
    html = setAttr(html, 'name="twitter:title"', 'content', title)
  }
  if (description) {
    html = setAttr(html, 'name="description"', 'content', description)
    html = setAttr(html, 'property="og:description"', 'content', description)
    html = setAttr(html, 'name="twitter:description"', 'content', description)
  }
  if (canonical) {
    html = setAttr(html, 'rel="canonical"', 'href', canonical)
    html = setAttr(html, 'property="og:url"', 'content', canonical)
  }
  if (article) {
    html = setAttr(html, 'property="og:type"', 'content', 'article')
    const tags = [
      article.publishedTime &&
        `<meta property="article:published_time" content="${escapeAttr(article.publishedTime)}" />`,
      ...article.tags.map((tag) => `<meta property="article:tag" content="${escapeAttr(tag)}" />`),
      // `<` is escaped so post text can never close the script element.
      `<script type="application/ld+json">${JSON.stringify(article.jsonLd).replace(/</g, '\\u003c')}</script>`,
    ].filter(Boolean)
    html = html.replace('</head>', () => `    ${tags.join('\n    ')}\n  </head>`)
  }
  return html
}

for (const route of routes) {
  const html = applyMeta(template, getMeta(route)).replace(
    placeholder,
    `<div id="root">${render(route)}</div>`,
  )
  const outPath = path.join(distDir, route, 'index.html')
  await mkdir(path.dirname(outPath), { recursive: true })
  await writeFile(outPath, html)
  console.log(`prerender: wrote ${path.relative(root, outPath)}`)
}

const lastmod = new Map(feedPosts.map((post) => [post.url, post.date]))
const sitemapEntry = (route) => {
  const loc = `${SITE_URL}${route}`
  const date = lastmod.get(loc)
  return `  <url>\n    <loc>${loc}</loc>\n${date ? `    <lastmod>${date}</lastmod>\n` : ''}  </url>`
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(sitemapEntry).join('\n')}
</urlset>
`
await writeFile(path.join(distDir, 'sitemap.xml'), sitemap)
console.log(`prerender: wrote dist/sitemap.xml (${routes.length} urls)`)

// RSS 2.0 feed with full post content, so readers can follow the blog.
const cdata = (s) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`
const rfc822 = (date) => new Date(`${date}T00:00:00Z`).toUTCString()
const rssItem = (post) => `    <item>
      <title>${escapeAttr(post.title)}</title>
      <link>${post.url}</link>
      <guid isPermaLink="true">${post.url}</guid>
${post.date ? `      <pubDate>${rfc822(post.date)}</pubDate>\n` : ''}${post.tags.map((tag) => `      <category>${escapeAttr(tag)}</category>\n`).join('')}      <description>${escapeAttr(post.abstract)}</description>
      <content:encoded>${cdata(post.html)}</content:encoded>
    </item>`
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeAttr(SITE_TITLE)} — blog</title>
    <link>${SITE_URL}/#blog</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Posts by ${escapeAttr(SITE_TITLE)} on robotics, AI and software engineering.</description>
    <language>en</language>
${feedPosts[0]?.date ? `    <lastBuildDate>${rfc822(feedPosts[0].date)}</lastBuildDate>\n` : ''}${feedPosts.map(rssItem).join('\n')}
  </channel>
</rss>
`
await writeFile(path.join(distDir, 'rss.xml'), rss)
console.log(`prerender: wrote dist/rss.xml (${feedPosts.length} posts)`)

await rm(ssrDir, { recursive: true, force: true })
