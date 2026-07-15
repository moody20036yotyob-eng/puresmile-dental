import React from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const { pick } = useLang()

  return (
    <footer style={{ backgroundColor: 'white', borderTop: '1px solid #F3F4F6' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span style={{ fontSize: '1.5rem' }}>🦷</span>
              <span style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>
                Pure<span style={{ color: '#10B981' }}>Smile</span>
              </span>
            </div>
            <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: '1.6' }}>
              {pick({
                en: 'Premium dental care in the heart of Dubai. Your smile is our mission.',
                ar: 'رعاية أسنان متميزة في قلب دبي. ابتسامتك هي مهمتنا.',
              })}
            </p>
            <div className="flex gap-3 mt-4">
              {['📘', '📷', '🐦', '▶️'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: '2rem', height: '2rem', borderRadius: '50%',
                    backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '0.8rem', textDecoration: 'none',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#D1FAE5'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontWeight: 700, color: '#111827', marginBottom: '1rem', fontSize: '0.95rem' }}>
              {pick({ en: 'Quick Links', ar: 'روابط سريعة' })}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { to: '/', label: { en: 'Home', ar: 'الرئيسية' } },
                { to: '/services', label: { en: 'Services', ar: 'الخدمات' } },
                { to: '/about', label: { en: 'About Us', ar: 'عن العيادة' } },
                { to: '/booking', label: { en: 'Book Appointment', ar: 'حجز موعد' } },
                { to: '/contact', label: { en: 'Contact', ar: 'تواصل معنا' } },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    style={{ color: '#6B7280', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#10B981'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
                  >
                    {pick(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontWeight: 700, color: '#111827', marginBottom: '1rem', fontSize: '0.95rem' }}>
              {pick({ en: 'Our Services', ar: 'خدماتنا' })}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { en: 'General Dentistry', ar: 'طب الأسنان العام' },
                { en: 'Cosmetic Dentistry', ar: 'طب الأسنان التجميلي' },
                { en: 'Orthodontics', ar: 'تقويم الأسنان' },
                { en: 'Dental Implants', ar: 'زراعة الأسنان' },
                { en: 'Teeth Whitening', ar: 'تبييض الأسنان' },
              ].map((s, i) => (
                <li key={i}>
                  <Link
                    to="/services"
                    style={{ color: '#6B7280', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#10B981'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6B7280'}
                  >
                    {pick(s)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontWeight: 700, color: '#111827', marginBottom: '1rem', fontSize: '0.95rem' }}>
              {pick({ en: 'Contact Us', ar: 'تواصل معنا' })}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { icon: '📍', en: 'Business Bay, Dubai, UAE', ar: 'الخليج التجاري، دبي، الإمارات' },
                { icon: '📞', en: '+971 4 123 4567', ar: '+971 4 123 4567' },
                { icon: '✉️', en: 'hello@puresmile.ae', ar: 'hello@puresmile.ae' },
                { icon: '🕐', en: 'Sun–Thu: 9am–8pm', ar: 'الأحد–الخميس: ٩ص–٨م' },
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.5rem', color: '#6B7280', fontSize: '0.875rem' }}>
                  <span>{item.icon}</span>
                  <span>{pick(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #F3F4F6', marginTop: '2.5rem', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <p style={{ color: '#9CA3AF', fontSize: '0.8rem' }}>
            © 2025 PureSmile Dental. {pick({ en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.' })}
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
              { en: 'Terms of Service', ar: 'شروط الخدمة' },
            ].map((l, i) => (
              <a key={i} href="#" style={{ color: '#9CA3AF', fontSize: '0.8rem', textDecoration: 'none' }}>{pick(l)}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
