import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.tsx'

// Used at build time only (see scripts/prerender.mjs) to bake the page's HTML
// into dist/index.html so crawlers and link previews see real content.
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
