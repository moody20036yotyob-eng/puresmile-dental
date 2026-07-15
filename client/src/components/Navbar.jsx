import React, { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LanguageContext'

const links = [
  { to: '/', label: { en: 'Home', ar: 'الرئيسية' }, exact: true },
  { to: '/services', label: { en: 'Services', ar: 'الخدمات' } },
  { to: '/about', label: { en: 'About', ar: 'عن العيادة' } },
  { to: '/faq', label: { en: 'FAQ', ar: 'الأسئلة الشائعة' } },
  { to: '/contact', label: { en: 'Contact', ar: 'تواصل معنا' } },
]

export default function Navbar() {
  const { lang, toggle, pick } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        backgroundColor: 'white',
        boxShadow: scrolled ? '0 2px 16px rgba(16,185,129,0.08)' : 'none',
        borderBottom: scrolled ? 'none' : '1px solid #F3F4F6',
        transition: 'box-shadow 0.3s',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span style={{ fontSize: '1.6rem' }}>🦷</span>
            <span
              style={{
                fontFamily: '"DM Sans", sans-serif',
                fontWeight: 700,
                fontSize: '1.2rem',
                color: '#111827',
              }}
            >
              Pure<span style={{ color: '#10B981' }}>Smile</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                style={({ isActive }) => ({
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: isActive ? '#10B981' : '#374151',
                  textDecoration: 'none',
                  position: 'relative',
                  paddingBottom: '4px',
                })}
                className={({ isActive }) => isActive ? 'nav-link-active' : ''}
              >
                {pick(link.label)}
              </NavLink>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggle}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                border: '1.5px solid #10B981',
                color: '#10B981',
                fontWeight: 600,
                fontSize: '0.82rem',
                background: 'transparent',
                cursor: 'pointer',
                fontFamily: lang === 'en' ? 'Cairo, sans-serif' : 'Inter, sans-serif',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#10B981'; e.currentTarget.style.color = 'white' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#10B981' }}
            >
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>

            {/* Book button (desktop) */}
            <Link to="/booking" className="hidden md:flex btn-coral" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
              {pick({ en: 'Book Now', ar: 'احجز الآن' })}
            </Link>

            {/* Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg"
              onClick={() => setMenuOpen(o => !o)}
              style={{ color: '#374151' }}
              aria-label="Menu"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <>
                    <line x1="4" y1="4" x2="18" y2="18" />
                    <line x1="18" y1="4" x2="4" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="19" y2="6" />
                    <line x1="3" y1="12" x2="19" y2="12" />
                    <line x1="3" y1="18" x2="19" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', backgroundColor: 'white', borderTop: '1px solid #F3F4F6' }}
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.exact}
                  onClick={() => setMenuOpen(false)}
                  style={({ isActive }) => ({
                    fontSize: '1rem',
                    fontWeight: 500,
                    color: isActive ? '#10B981' : '#374151',
                    textDecoration: 'none',
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #F3F4F6',
                  })}
                >
                  {pick(link.label)}
                </NavLink>
              ))}
              <Link
                to="/booking"
                className="btn-coral mt-2"
                style={{ justifyContent: 'center' }}
                onClick={() => setMenuOpen(false)}
              >
                {pick({ en: 'Book Now', ar: 'احجز الآن' })}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
