import type { Post } from '../data/posts'

function PostPage({ post }: { post: Post }) {
  return (
    <main>
      <a className="post-back" href="/#blog">
        ← back
      </a>
      <article className="post">
        <h1 className="post-title">{post.title}</h1>
        {post.date && <time className="post-date" dateTime={post.date}>{post.date}</time>}
        {/* Body is the site owner's own Markdown, rendered to HTML at build time. */}
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />
      </article>
    </main>
  )
}

export default PostPage
