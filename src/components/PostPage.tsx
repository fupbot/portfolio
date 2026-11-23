import { getAdjacentPosts, postPath, type Post } from '../data/posts'

function PostPage({ post }: { post: Post }) {
  const { newer, older } = getAdjacentPosts(post.slug)

  return (
    <main>
      <a className="post-back" href="/#blog">
        ← back
      </a>
      <article className="post">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          {post.date && <time dateTime={post.date}>{post.date}</time>}
          <span>{post.readingMinutes} min read</span>
        </div>
        {post.tags.length > 0 && (
          <ul className="post-tags">
            {post.tags.map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>
        )}
        {/* Body is the site owner's own Markdown, rendered to HTML at build time. */}
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>

      {/* TODO: comments via Giscus (https://giscus.app), stored as GitHub Discussions.
          Readers sign in with GitHub, so each comment shows their username; moderate in
          the repo's Discussions tab. Setup: make fupbot/portfolio public, enable
          Discussions + create a "Blog comments" category, install the Giscus GitHub app,
          then get repo-id and category-id from giscus.app. Implement as a client-only
          <Comments /> component here (inject the script in useEffect so the prerendered
          HTML stays the same), mapping each thread by pathname, dark theme. */}

      {(newer || older) && (
        <nav className="post-nav" aria-label="More posts">
          {older ? (
            <a className="post-nav-link" href={postPath(older.slug)}>
              <span className="post-nav-label">← older</span>
              <span className="post-nav-title">{older.title}</span>
            </a>
          ) : (
            <span />
          )}
          {newer && (
            <a className="post-nav-link post-nav-newer" href={postPath(newer.slug)}>
              <span className="post-nav-label">newer →</span>
              <span className="post-nav-title">{newer.title}</span>
            </a>
          )}
        </nav>
      )}
    </main>
  )
}

export default PostPage
