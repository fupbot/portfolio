import { languageLabels, projects } from '../data/projects'
import { postPath, posts } from '../data/posts'
import { GITHUB_URL, LINKEDIN_URL } from '../links'

function Home() {
  return (
    <>
      <header className="hero">
        <h1 className="hero-name">Fabio Ugalde</h1>
        <p className="hero-role">
          Software Engineer
          <img className="hero-flag" src="/flag-br.svg" alt="Brazil" title="Brazil" />
          <img className="hero-flag" src="/flag-it.svg" alt="Italy" title="Italy" />
        </p>
        <p className="hero-tagline">Fullstack, robotics, AI, data and engineering.</p>
        <div id="contact" className="hero-links">
          <a className="hero-link" href={GITHUB_URL} target="_blank" rel="noreferrer">
            github.com/fupbot
          </a>
          <a className="hero-link" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            linkedin.com/in/fabiougalde
          </a>
        </div>
      </header>

      <main>
        <section id="projects" className="section">
          <h2 className="section-title">projects</h2>
          <div className="project-grid">
            {projects.map((project) => (
              <a
                key={project.id}
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

        <section id="about" className="section about">
          <h2 className="section-title">about me</h2>
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

        <section id="blog" className="section blog">
          <h2 className="section-title">blog</h2>
          {posts.length === 0 ? (
            <p className="blog-empty">No posts yet.</p>
          ) : (
            <div className="post-list">
              {posts.map((post) => (
                <a key={post.slug} className="post-item" href={postPath(post.slug)}>
                  <div className="post-item-head">
                    <span className="post-item-title">{post.title}</span>
                    {post.date && (
                      <time className="post-item-date" dateTime={post.date}>
                        {post.date}
                      </time>
                    )}
                  </div>
                  {post.abstract && <p className="post-item-abstract">{post.abstract}</p>}
                </a>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}

export default Home
