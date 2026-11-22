const LINKS = [
  { href: '/#contact', label: 'contact' },
  { href: '/#projects', label: 'projects' },
  { href: '/#about', label: 'about me' },
  { href: '/#blog', label: 'blog' },
]

function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        {LINKS.map((link) => (
          <a key={link.href} className="nav-link" href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export default Nav
