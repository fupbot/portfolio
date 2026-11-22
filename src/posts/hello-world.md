---
title: Hello, world
date: 2026-11-22
abstract: An example post showing how the blog works. Replace or delete this file once you write your first real post.
draft: true
---
This is an example post. Every `.md` file in `src/posts/` becomes a post, and the file name is the URL: this one lives at `/blog/hello-world/`.

## Frontmatter

The block between the `---` lines at the top sets:

- `title`: shown on the homepage and as the page title
- `date`: in `YYYY-MM-DD` format; posts are sorted newest first
- `abstract`: the short summary on the homepage (also used for the page's meta description)
- `draft`: `true` hides the post from the production build; it still shows in `npm run dev`

## Body

Everything below the frontmatter is regular Markdown: **bold**, *italic*, [links](https://github.com/fupbot), lists, and code:

```python
print("hello, robots")
```
