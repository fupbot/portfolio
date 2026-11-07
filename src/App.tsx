import { languageLabels, projects } from './data/projects'
import './App.css'

const GITHUB_URL = 'https://github.com/fupbot'
const LINKEDIN_URL = 'https://linkedin.com/in/fabiougalde'

function App() {
  return (
    <div className="page">
      <header className="hero">
        <h1 className="hero-name">Fabio Ugalde</h1>
        <p className="hero-role">
          Software Engineer
          <img className="hero-flag" src="/flag-br.svg" alt="Brazil" title="Brazil" />
          <img className="hero-flag" src="/flag-it.svg" alt="Italy" title="Italy" />
        </p>
        <p className="hero-tagline">Fullstack, robotics, AI, data and engineering.</p>
        <div className="hero-links">
          <a className="hero-link" href={GITHUB_URL} target="_blank" rel="noreferrer">
            github.com/fupbot
          </a>
          <a className="hero-link" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            linkedin.com/in/fabiougalde
          </a>
        </div>
      </header>

      <main>
        <section className="section">
          <h2 className="section-title">projects</h2>
          <div className="project-grid">
            {projects.map((project) => (
              <a
                key={project.name}
                className="project-card"
                href={project.url}
                target="_blank"
                rel="noreferrer"
              >
                <div className="project-card-head">
                  <span className="project-name">{project.name}</span>
                  <span className="project-langs">
                    {project.languages.map((lang) => (
                      <img
                        key={lang}
                        className="project-lang-icon"
                        src={`/langs/${lang}.svg`}
                        alt={languageLabels[lang]}
                        title={languageLabels[lang]}
                      />
                    ))}
                  </span>
                </div>
                <p className="project-description">{project.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="section about">
          <p className="hero-about-intro">If you want to know a little bit more about Fabio:</p>
          <p className="hero-about">
            Software engineer at Samsung's partner R&amp;D SiDi, designing and deploying autonomous
            mobile robot fleets, computer vision inspection systems, and AI-driven robot control
            (ROS 2, LLM/agentic integrations, YOLO) — backed by full-stack development skills
            (Python, React) to build complete, end-to-end solutions from sensor to cloud. With a
            background in Control and Automation Engineering and an MBA in AI and Data Science, he
            bridges hardware, software, and systems architecture for senior robotics, tech lead, or
            solution architect roles.
          </p>
        </section>
      </main>

      <footer className="footer">
        <a href={GITHUB_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </footer>
    </div>
  )
}

export default App
