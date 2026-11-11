// Injects the server-rendered app HTML into dist/index.html, then removes the
// temporary SSR bundle. Runs as the last step of `npm run build`.
import { readFile, writeFile, rm } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ssrDir = path.join(root, 'dist-ssr')
const indexPath = path.join(root, 'dist', 'index.html')

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

const placeholder = '<div id="root"></div>'
const template = await readFile(indexPath, 'utf8')
if (!template.includes(placeholder)) {
  throw new Error(`prerender: "${placeholder}" not found in dist/index.html`)
}

await writeFile(indexPath, template.replace(placeholder, `<div id="root">${render()}</div>`))
await rm(ssrDir, { recursive: true, force: true })
console.log('prerender: wrote dist/index.html')
