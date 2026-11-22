import Home from './components/Home'
import Nav from './components/Nav'
import PostPage from './components/PostPage'
import { getPost, slugFromPath } from './data/posts'
import { GITHUB_URL, LINKEDIN_URL } from './links'
import './App.css'

// `path` is window.location.pathname in the browser and the route being
// prerendered at build time (see src/entry-server.tsx).
function App({ path }: { path: string }) {
  const slug = slugFromPath(path)
  const post = slug ? getPost(slug) : undefined

  return (
    <>
      <Nav />
      <div className="page">
        {post ? <PostPage post={post} /> : <Home />}

        <footer className="footer">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </footer>
      </div>
    </>
  )
}

export default App
