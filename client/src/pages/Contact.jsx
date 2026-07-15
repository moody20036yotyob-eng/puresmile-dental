import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { useSEO } from '../hooks/useSEO'

const INFO_CARDS = [
  { icon: '📍', en: 'Location', ar: 'الموقع', detail: { en: 'Level 4, Aspect Tower, Business Bay, Dubai, UAE', ar: 'الطابق 4، برج أسبكت، الخليج التجاري، دبي، الإمارات' } },
  { icon: '📞', en: 'Phone', ar: 'الهاتف', detail: { en: '+971 4 123 4567', ar: '+971 4 123 4567' } },
  { icon: '✉️', en: 'Email', ar: 'البريد الإلكتروني', detail: { en: 'hello@puresmile.ae', ar: 'hello@puresmile.ae' } },
  { icon: '🕐', en: 'Opening Hours', ar: 'ساعات العمل', detail: { en: 'Sun–Thu: 9am–8pm\nFri: 10am–6pm\nSat: 10am–4pm', ar: 'الأحد–الخميس: ٩ص–٨م\nالجمعة: ١٠ص–٦م\nالسبت: ١٠ص–٤م' } },
]

export default function Contact() {
  const { pick, lang } = useLang()
  useSEO({
    title: pick({ en: 'Contact PureSmile Dental Dubai — Business Bay Clinic', ar: 'تواصل مع PureSmile Dental دبي — عيادة الخليج التجاري' }),
    description: pick({ en: 'Contact PureSmile Dental in Business Bay, Dubai. Call +971 4 123 4567, WhatsApp, or book online. Emergency dental appointments available 7 days a week.', ar: 'تواصل مع PureSmile Dental في الخليج التجاري، دبي. اتصل أو WhatsApp أو احجز عبر الإنترنت. مواعيد طوارئ متاحة 7 أيام.' }),
    canonical: 'https://puresmile.ae/contact',
    lang,
  })
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ backgroundColor: 'white', padding: '4rem 0 3rem' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-badge">{pick({ en: 'Get in Touch', ar: 'تواصل معنا' })}</span>
            <h1 style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', color: '#111827' }}>
              {pick({ en: 'Contact Us', ar: 'اتصل بنا' })}
            </h1>
            <p style={{ color: '#6B7280', marginTop: '0.75rem', maxWidth: '480px', margin: '0.75rem auto 0' }}>
              {pick({ en: "We'd love to hear from you. Whether you have a question, feedback, or want to book an appointment.", ar: 'يسعدنا التواصل معك. سواء كان لديك سؤال أو تعليق أو ترغب في حجز موعد.' })}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Info cards */}
          <div>
            {/* Contact: "Monument" cards — large icon on colored circle, label above, detail below, centered */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {INFO_CARDS.map((card, i) => {
                const palettes = [
                  { bg: '#D1FAE5', icon: '#10B981' },
                  { bg: '#FED7AA', icon: '#F97316' },
                  { bg: '#E0E7FF', icon: '#6366F1' },
                  { bg: '#FEF3C7', icon: '#F59E0B' },
                ]
                const p = palettes[i]
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -4, boxShadow: '0 12px 36px rgba(16,185,129,0.12)' }}
                    style={{
                      backgroundColor: 'white', borderRadius: '1.25rem',
                      padding: '1.75rem 1rem', textAlign: 'center',
                      boxShadow: '0 2px 12px rgba(17,24,39,0.06)',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                  >
                    <div style={{
                      width: '3.5rem', height: '3.5rem', borderRadius: '50%',
                      backgroundColor: p.bg, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '1.6rem',
                      margin: '0 auto 0.875rem',
                    }}>
                      {card.icon}
                    </div>
                    <div style={{ fontWeight: 700, color: p.icon, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.4rem' }}>
                      {pick({ en: card.en, ar: card.ar })}
                    </div>
                    <p style={{ color: '#374151', fontSize: '0.82rem', lineHeight: 1.6, whiteSpace: 'pre-line', fontWeight: 500 }}>
                      {pick(card.detail)}
                    </p>
                  </motion.div>
                )
              })}
            </div>

            {/* Map placeholder */}
            <div style={{
              backgroundColor: 'white', borderRadius: '1rem', overflow: 'hidden',
              height: '250px', boxShadow: '0 2px 16px rgba(17,24,39,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '0.5rem', color: '#6B7280',
            }}>
              <span style={{ fontSize: '3rem' }}>🗺️</span>
              <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{pick({ en: 'Business Bay, Dubai', ar: 'الخليج التجاري، دبي' })}</p>
              <a
                href="https://maps.google.com/?q=Business+Bay+Dubai"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-mint"
                style={{ fontSize: '0.8rem', padding: '0.4rem 1rem', marginTop: '0.25rem' }}
              >
                {pick({ en: 'Open in Maps', ar: 'افتح في الخرائط' })}
              </a>
            </div>
          </div>

          {/* Right: Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 16px rgba(17,24,39,0.06)' }}
          >
            {sent ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontFamily: '"DM Sans"', fontWeight: 700, fontSize: '1.3rem', color: '#111827', marginBottom: '0.5rem' }}>
                  {pick({ en: 'Message Sent!', ar: 'تم إرسال الرسالة!' })}
                </h3>
                <p style={{ color: '#6B7280' }}>
                  {pick({ en: "Thank you for reaching out. We'll get back to you within 24 hours.", ar: 'شكراً على تواصلك. سنرد عليك في غضون 24 ساعة.' })}
                </p>
                <button className="btn-mint" style={{ marginTop: '1.5rem' }} onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', message: '' }) }}>
                  {pick({ en: 'Send Another', ar: 'أرسل رسالة أخرى' })}
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 700, fontSize: '1.3rem', color: '#111827', marginBottom: '1.5rem' }}>
                  {pick({ en: 'Send Us a Message', ar: 'أرسل لنا رسالة' })}
                </h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { name: 'name', label: { en: 'Full Name', ar: 'الاسم الكامل' }, type: 'text', required: true },
                    { name: 'email', label: { en: 'Email Address', ar: 'البريد الإلكتروني' }, type: 'email', required: true },
                    { name: 'phone', label: { en: 'Phone Number', ar: 'رقم الهاتف' }, type: 'tel', required: false },
                  ].map(field => (
                    <div key={field.name}>
                      <label style={{ display: 'block', fontWeight: 500, fontSize: '0.875rem', color: '#374151', marginBottom: '0.4rem' }}>
                        {pick(field.label)} {field.required && <span style={{ color: '#F97316' }}>*</span>}
                      </label>
                      <input
                        type={field.type}
                        name={field.name}
                        value={form[field.name]}
                        onChange={handleChange}
                        required={field.required}
                        style={{
                          width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                          border: '1.5px solid #E5E7EB', fontSize: '0.9rem', color: '#111827',
                          outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = '#10B981'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                      />
                    </div>
                  ))}

                  <div>
                    <label style={{ display: 'block', fontWeight: 500, fontSize: '0.875rem', color: '#374151', marginBottom: '0.4rem' }}>
                      {pick({ en: 'Message', ar: 'الرسالة' })} <span style={{ color: '#F97316' }}>*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                        border: '1.5px solid #E5E7EB', fontSize: '0.9rem', color: '#111827',
                        outline: 'none', fontFamily: 'inherit', resize: 'vertical',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={e => e.target.style.borderColor = '#10B981'}
                      onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-coral"
                    style={{ justifyContent: 'center', opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? (
                      <><span className="spinner" style={{ width: '1.2rem', height: '1.2rem', borderWidth: '2px' }} /> {pick({ en: 'Sending…', ar: 'جارٍ الإرسال…' })}</>
                    ) : (
                      pick({ en: 'Send Message', ar: 'إرسال الرسالة' })
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Emergency strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <div className="emergency-strip" style={{ borderRadius: '1rem', padding: '1.25rem 1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.75rem' }}>🚨</span>
            <div>
              <div style={{ fontWeight: 700, color: '#92400E', fontSize: '0.95rem' }}>
                {pick({ en: 'Dental Emergency?', ar: 'حالة طوارئ أسنان؟' })}
              </div>
              <div style={{ color: '#78350F', fontSize: '0.85rem' }}>
                {pick({ en: 'We offer same-day emergency appointments 7 days a week.', ar: 'نقدم مواعيد طوارئ في نفس اليوم 7 أيام في الأسبوع.' })}
              </div>
            </div>
          </div>
          <a href="tel:+97141234567" className="btn-coral" style={{ fontSize: '0.875rem', padding: '0.6rem 1.25rem' }}>
            📞 {pick({ en: 'Call Emergency Line', ar: 'اتصل بخط الطوارئ' })}
          </a>
        </div>
      </div>
    </div>
  )
}
