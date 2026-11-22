// Fetches project metadata from the GitHub API and writes src/data/projects.json.
// Runs as the first step of `npm run build` (and in the daily scheduled deploy),
// so the prerendered site always reflects the current state of the repos.
// If GitHub is unreachable, the previously committed snapshot is kept.
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Curated list, in display order. Repo IDs survive renames.
// Optional per-repo overrides: `description`, `languages` (used when GitHub
// reports none of the languages we have icons for).
const REPOS = [
  { id: 1372921214 }, // llm_memory (formerly robot_ai_memory)
  { id: 1360724225, languages: ['typescript'] }, // acontabill
  { id: 1346724091 }, // tapngo
  { id: 518196201 }, // ROSActiveExplorationCMP545
  { id: 500985521 }, // AutomaticPivotDetectorCMP197
  { id: 481371144 }, // AlgorithmsForHeartDiseaseCMP263
]

// GitHub language name -> key with an icon in public/langs/
const LANGUAGE_MAP = {
  TypeScript: 'typescript',
  Python: 'python',
  'C++': 'cpp',
  'Jupyter Notebook': 'jupyter',
}
const MIN_LANGUAGE_SHARE = 0.05

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outPath = path.join(root, 'src', 'data', 'projects.json')

const headers = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
  'User-Agent': 'portfolio-build',
}
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

async function getJson(url) {
  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`)
  return res.json()
}

function pickLanguages(bytesByLanguage, fallback = []) {
  const total = Object.values(bytesByLanguage).reduce((a, b) => a + b, 0)
  const langs = Object.entries(bytesByLanguage)
    .filter(([name, bytes]) => LANGUAGE_MAP[name] && total > 0 && bytes / total >= MIN_LANGUAGE_SHARE)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => LANGUAGE_MAP[name])
  return langs.length > 0 ? langs : fallback
}

async function fetchProject({ id, description, languages }) {
  const base = `https://api.github.com/repositories/${id}`
  const [repo, langBytes] = await Promise.all([getJson(base), getJson(`${base}/languages`)])
  return {
    id,
    name: repo.name,
    description: description ?? repo.description ?? '',
    languages: pickLanguages(langBytes, languages),
    url: repo.html_url,
  }
}

let previous = []
try {
  previous = JSON.parse(await readFile(outPath, 'utf8'))
} catch {
  // no snapshot yet
}

const results = await Promise.allSettled(REPOS.map(fetchProject))
const projects = []
let failures = 0
results.forEach((result, i) => {
  const { id } = REPOS[i]
  if (result.status === 'fulfilled') {
    projects.push(result.value)
    return
  }
  failures++
  const cached = previous.find((p) => p.id === id)
  console.warn(`fetch-projects: repo ${id} failed (${result.reason.message}); ${cached ? 'using snapshot' : 'skipping'}`)
  if (cached) projects.push(cached)
})

await writeFile(outPath, JSON.stringify(projects, null, 2) + '\n')
console.log(`fetch-projects: wrote ${projects.length} projects (${failures} from snapshot/failed)`)
