import data from './projects.json'

export type Language = 'typescript' | 'python' | 'cpp' | 'jupyter'

export const languageLabels: Record<Language, string> = {
  typescript: 'TypeScript',
  python: 'Python',
  cpp: 'C++',
  jupyter: 'Jupyter Notebook',
}

export interface Project {
  id: number
  name: string
  description: string
  languages: Language[]
  url: string
}

// Generated from the GitHub API by scripts/fetch-projects.mjs at build time.
// To add/remove/reorder projects, edit the REPOS list in that script.
export const projects = data as Project[]
