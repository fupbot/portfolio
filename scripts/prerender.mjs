// Prerenders every route (home + one page per blog post) into dist/, writes
// dist/sitemap.xml, then removes the temporary SSR bundle. Runs as the last
// step of `npm run build`.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ssrDir = path.join(root, 'dist-ssr')
const distDir = path.join(root, 'dist')
const indexPath = path.join(distDir, 'index.html')

const { render, routes, getMeta, SITE_URL } = await import(
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

function applyMeta(html, { title, description, canonical }) {
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

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url>\n    <loc>${SITE_URL}${route}</loc>\n  </url>`).join('\n')}
</urlset>
`
await writeFile(path.join(distDir, 'sitemap.xml'), sitemap)
console.log(`prerender: wrote dist/sitemap.xml (${routes.length} urls)`)

await rm(ssrDir, { recursive: true, force: true })
