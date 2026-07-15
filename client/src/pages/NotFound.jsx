import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'

export default function NotFound() {
  const { pick } = useLang()
  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <motion.div
          animate={{ y: [0, -16, 0], rotate: [0, 8, -8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: '6rem', marginBottom: '1.5rem', display: 'block' }}
        >
          🦷
        </motion.div>
        <h1 style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: '5rem', color: '#10B981', lineHeight: 1, marginBottom: '0.5rem' }}>
          404
        </h1>
        <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 700, fontSize: '1.5rem', color: '#111827', marginBottom: '0.75rem' }}>
          {pick({ en: 'Oops! Page Not Found', ar: 'عذراً! الصفحة غير موجودة' })}
        </h2>
        <p style={{ color: '#6B7280', marginBottom: '2rem', lineHeight: 1.7 }}>
          {pick({
            en: "Looks like this page went missing — just like a baby tooth! Let's get you back on track.",
            ar: 'يبدو أن هذه الصفحة اختفت — تماماً مثل سن الحليب! دعنا نعيدك إلى المسار الصحيح.',
          })}
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn-coral">{pick({ en: 'Back to Home', ar: 'العودة للرئيسية' })}</Link>
          <Link to="/booking" className="btn-mint-outline">{pick({ en: 'Book Appointment', ar: 'احجز موعد' })}</Link>
        </div>
      </div>
    </div>
  )
}
