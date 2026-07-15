import { useEffect } from 'react'

export function useSEO({ title, description, canonical, lang = 'en' }) {
  useEffect(() => {
    // Title
    if (title) document.title = `${title} | PureSmile Dental Dubai`

    // Meta description
    setMeta('name', 'description', description)

    // OG
    setMeta('property', 'og:title', title ? `${title} | PureSmile Dental Dubai` : null)
    setMeta('property', 'og:description', description)
    if (canonical) setMeta('property', 'og:url', canonical)

    // Twitter
    setMeta('name', 'twitter:title', title ? `${title} | PureSmile Dental Dubai` : null)
    setMeta('name', 'twitter:description', description)

    // Canonical
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = canonical
    }

    // Lang
    document.documentElement.lang = lang
  }, [title, description, canonical, lang])
}

function setMeta(attr, name, content) {
  if (!content) return
  let el = document.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}
