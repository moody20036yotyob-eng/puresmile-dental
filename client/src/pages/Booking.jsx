import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { useSEO } from '../hooks/useSEO'

const SERVICES = [
  { id: 1, icon: '🦷', en: 'General Check-up', ar: 'فحص عام', duration: '45 min', price: 'AED 150' },
  { id: 2, icon: '🧹', en: 'Teeth Cleaning', ar: 'تنظيف الأسنان', duration: '60 min', price: 'AED 250' },
  { id: 3, icon: '🌟', en: 'Teeth Whitening', ar: 'تبييض الأسنان', duration: '90 min', price: 'AED 800' },
  { id: 4, icon: '✨', en: 'Porcelain Veneers', ar: 'قشور البورسلين', duration: '2 visits', price: 'From AED 1,500' },
  { id: 5, icon: '📐', en: 'Invisalign Consultation', ar: 'استشارة انفيزيلاين', duration: '30 min', price: 'Free' },
  { id: 6, icon: '🔩', en: 'Dental Implant Consultation', ar: 'استشارة زراعة الأسنان', duration: '30 min', price: 'Free' },
  { id: 7, icon: '🔧', en: 'Dental Filling', ar: 'حشوة سن', duration: '60 min', price: 'AED 300' },
  { id: 8, icon: '🆘', en: 'Emergency Appointment', ar: 'موعد طوارئ', duration: '30 min', price: 'AED 200' },
]

const DOCTORS = [
  { id: 1, name: { en: 'Dr. Sarah Mitchell', ar: 'د. سارة ميتشل' }, specialty: { en: 'Cosmetic Dentist', ar: 'طب أسنان تجميلي' }, emoji: '👩‍⚕️', services: [1, 2, 3, 4] },
  { id: 2, name: { en: 'Dr. Ahmed Al-Rashid', ar: 'د. أحمد الراشد' }, specialty: { en: 'Orthodontist', ar: 'تقويم أسنان' }, emoji: '👨‍⚕️', services: [1, 5] },
  { id: 3, name: { en: 'Dr. Priya Sharma', ar: 'د. بريا شارما' }, specialty: { en: 'Implant Surgeon', ar: 'جراحة زراعة الأسنان' }, emoji: '👩‍⚕️', services: [1, 6, 8] },
  { id: 4, name: { en: 'Dr. Khalid Hassan', ar: 'د. خالد حسان' }, specialty: { en: 'Endodontist', ar: 'علاج جذور الأسنان' }, emoji: '👨‍⚕️', services: [1, 7, 8] },
]

const TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '17:00', '17:30']

function getDates() {
  const dates = []
  const now = new Date()
  for (let i = 1; i <= 14; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    if (d.getDay() !== 5) dates.push(d)
  }
  return dates.slice(0, 10)
}

const DATES = getDates()

const STEPS = [
  { en: 'Choose Service', ar: 'اختر الخدمة' },
  { en: 'Pick Doctor', ar: 'اختر الطبيب' },
  { en: 'Date & Time', ar: 'التاريخ والوقت' },
  { en: 'Confirm', ar: 'تأكيد' },
]

export default function Booking() {
  const { pick, lang } = useLang()
  useSEO({
    title: pick({ en: 'Book a Dental Appointment in Dubai | PureSmile', ar: 'احجز موعد أسنان في دبي | PureSmile' }),
    description: pick({ en: 'Book your dental appointment online in 4 easy steps. Choose service, doctor, date & time. Same-day appointments available at PureSmile Dental Dubai.', ar: 'احجز موعد أسنانك عبر الإنترنت في 4 خطوات سهلة. اختر الخدمة والطبيب والتاريخ والوقت.' }),
    canonical: 'https://puresmile.ae/booking',
    lang,
  })
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState({ service: null, doctor: null, date: null, time: null })
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' })
  const [confirmed, setConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)

  const availableDoctors = selected.service
    ? DOCTORS.filter(d => d.services.includes(selected.service.id))
    : DOCTORS

  const handleFormChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleConfirm = async e => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setConfirmed(true)
    setLoading(false)
  }

  const reset = () => {
    setStep(0)
    setSelected({ service: null, doctor: null, date: null, time: null })
    setForm({ name: '', phone: '', email: '', notes: '' })
    setConfirmed(false)
  }

  const formatDate = d => d.toLocaleDateString(pick({ en: 'en-AE', ar: 'ar-AE' }), { weekday: 'short', month: 'short', day: 'numeric' })

  if (confirmed) {
    return (
      <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            backgroundColor: 'white', borderRadius: '1.5rem',
            padding: '3rem', textAlign: 'center', maxWidth: '480px',
            boxShadow: '0 8px 40px rgba(16,185,129,0.12)',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: '1.5rem', color: '#111827', marginBottom: '0.75rem' }}>
            {pick({ en: 'Appointment Confirmed!', ar: 'تم تأكيد الموعد!' })}
          </h2>
          <p style={{ color: '#6B7280', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {pick({
              en: `Your appointment for ${selected.service?.en} is confirmed for ${selected.date ? formatDate(selected.date) : ''} at ${selected.time}. A confirmation has been sent to ${form.email}.`,
              ar: `تم تأكيد موعدك لـ ${selected.service?.ar} في ${selected.date ? formatDate(selected.date) : ''} الساعة ${selected.time}. تم إرسال تأكيد إلى ${form.email}.`,
            })}
          </p>
          <div style={{ backgroundColor: '#F9FAFB', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>{pick({ en: 'Service', ar: 'الخدمة' })}</span>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{pick({ en: selected.service?.en, ar: selected.service?.ar }) || '-'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>{pick({ en: 'Doctor', ar: 'الطبيب' })}</span>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{selected.doctor ? pick(selected.doctor.name) : pick({ en: 'Any Available', ar: 'أي طبيب متاح' })}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>{pick({ en: 'Date', ar: 'التاريخ' })}</span>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{selected.date ? formatDate(selected.date) : '-'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>{pick({ en: 'Time', ar: 'الوقت' })}</span>
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{selected.time || '-'}</span>
            </div>
          </div>
          <button className="btn-mint" onClick={reset} style={{ width: '100%', justifyContent: 'center' }}>
            {pick({ en: 'Book Another Appointment', ar: 'احجز موعداً آخر' })}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Header */}
      <section style={{ backgroundColor: 'white', padding: '3rem 0 2.5rem', borderBottom: '1px solid #F3F4F6' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="section-badge">{pick({ en: 'Easy Online Booking', ar: 'حجز سهل عبر الإنترنت' })}</span>
          <h1 style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', color: '#111827', marginBottom: '2rem' }}>
            {pick({ en: 'Book Your Appointment', ar: 'احجز موعدك' })}
          </h1>

          {/* Step indicators */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0' }}>
            {STEPS.map((s, i) => (
              <React.Fragment key={i}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
                  <div className={`step-indicator ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: i === step ? '#F97316' : '#9CA3AF', fontWeight: i === step ? 600 : 400, whiteSpace: 'nowrap' }}>
                    {pick(s)}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ height: '2px', width: '4rem', backgroundColor: i < step ? '#10B981' : '#E5E7EB', marginBottom: '1.25rem', transition: 'background 0.3s' }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <AnimatePresence mode="wait">
          {/* STEP 0: Choose Service */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 700, fontSize: '1.2rem', color: '#111827', marginBottom: '1.25rem' }}>
                {pick({ en: 'Select a Service', ar: 'اختر خدمة' })}
              </h2>
              {/* Booking Step 1: "Checkbox Row" — icon square + text + price badge + radio dot */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {SERVICES.map((s, idx) => {
                  const isActive = selected.service?.id === s.id
                  const rowColors = ['#D1FAE5','#FEF3C7','#E0E7FF','#FCE7F3','#CCFBF1','#FFF7ED','#FEE2E2','#F0FDF4']
                  return (
                    <button
                      key={s.id}
                      onClick={() => { setSelected(sel => ({ ...sel, service: s })); setStep(1) }}
                      style={{
                        backgroundColor: isActive ? '#ECFDF5' : 'white',
                        border: isActive ? '2px solid #10B981' : '2px solid #F3F4F6',
                        borderRadius: '0.875rem', padding: '0.875rem 1.1rem',
                        textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                        display: 'flex', alignItems: 'center', gap: '0.875rem', width: '100%',
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = '#10B981' }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = '#F3F4F6' }}
                    >
                      {/* Icon square */}
                      <div style={{
                        width: '2.75rem', height: '2.75rem', borderRadius: '0.625rem',
                        backgroundColor: rowColors[idx % rowColors.length],
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.4rem', flexShrink: 0,
                      }}>
                        {s.icon}
                      </div>
                      {/* Text */}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>
                          {pick({ en: s.en, ar: s.ar })}
                        </div>
                        <div style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: '0.1rem' }}>⏱ {s.duration}</div>
                      </div>
                      {/* Price badge */}
                      <span style={{
                        backgroundColor: isActive ? '#10B981' : '#F3F4F6',
                        color: isActive ? 'white' : '#6B7280',
                        padding: '0.2rem 0.65rem', borderRadius: '9999px',
                        fontSize: '0.75rem', fontWeight: 600, flexShrink: 0,
                        transition: 'all 0.2s',
                      }}>
                        {s.price}
                      </span>
                      {/* Radio dot */}
                      <div style={{
                        width: '1.1rem', height: '1.1rem', borderRadius: '50%',
                        border: isActive ? '2px solid #10B981' : '2px solid #D1D5DB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'all 0.2s',
                      }}>
                        {isActive && <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', backgroundColor: '#10B981' }} />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 1: Pick Doctor */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 700, fontSize: '1.2rem', color: '#111827', marginBottom: '1.25rem' }}>
                {pick({ en: 'Choose Your Doctor', ar: 'اختر طبيبك' })}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {/* Any doctor option */}
                <button
                  onClick={() => { setSelected(sel => ({ ...sel, doctor: null })); setStep(2) }}
                  style={{
                    backgroundColor: selected.doctor === null && step > 1 ? '#D1FAE5' : 'white',
                    border: '2px dashed #D1FAE5', borderRadius: '0.75rem', padding: '1rem',
                    textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', color: '#6B7280', fontWeight: 500,
                  }}
                >
                  {pick({ en: 'No Preference — Any Available', ar: 'بدون تفضيل — أي طبيب متاح' })}
                </button>

                {availableDoctors.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => { setSelected(sel => ({ ...sel, doctor: doc })); setStep(2) }}
                    style={{
                      backgroundColor: selected.doctor?.id === doc.id ? '#D1FAE5' : 'white',
                      border: selected.doctor?.id === doc.id ? '2px solid #10B981' : '2px solid #E5E7EB',
                      borderRadius: '0.75rem', padding: '1rem', textAlign: 'left', cursor: 'pointer',
                      transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.75rem',
                    }}
                    onMouseEnter={e => { if (selected.doctor?.id !== doc.id) e.currentTarget.style.borderColor = '#10B981' }}
                    onMouseLeave={e => { if (selected.doctor?.id !== doc.id) e.currentTarget.style.borderColor = '#E5E7EB' }}
                  >
                    <span style={{ fontSize: '2rem' }}>{doc.emoji}</span>
                    <div>
                      <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>{pick(doc.name)}</div>
                      <div style={{ color: '#10B981', fontSize: '0.78rem', marginTop: '0.15rem' }}>{pick(doc.specialty)}</div>
                    </div>
                  </button>
                ))}
              </div>
              <button className="btn-mint-outline" style={{ fontSize: '0.875rem' }} onClick={() => setStep(0)}>
                ← {pick({ en: 'Back', ar: 'رجوع' })}
              </button>
            </motion.div>
          )}

          {/* STEP 2: Date & Time */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 700, fontSize: '1.2rem', color: '#111827', marginBottom: '1.25rem' }}>
                {pick({ en: 'Pick a Date', ar: 'اختر تاريخاً' })}
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                {DATES.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setSelected(sel => ({ ...sel, date: d, time: null }))}
                    style={{
                      padding: '0.6rem 0.9rem', borderRadius: '0.75rem',
                      border: selected.date?.toDateString() === d.toDateString() ? '2px solid #10B981' : '2px solid #E5E7EB',
                      backgroundColor: selected.date?.toDateString() === d.toDateString() ? '#D1FAE5' : 'white',
                      cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, color: '#374151',
                      transition: 'all 0.2s', textAlign: 'center', minWidth: '80px',
                    }}
                  >
                    {formatDateShort(d)}
                  </button>
                ))}
              </div>

              {selected.date && (
                <>
                  <h3 style={{ fontFamily: '"DM Sans"', fontWeight: 600, fontSize: '1rem', color: '#111827', marginBottom: '0.75rem' }}>
                    {pick({ en: 'Available Times', ar: 'الأوقات المتاحة' })}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }}>
                    {TIMES.map(t => (
                      <button
                        key={t}
                        onClick={() => setSelected(sel => ({ ...sel, time: t }))}
                        style={{
                          padding: '0.5rem 1rem', borderRadius: '0.5rem',
                          border: selected.time === t ? '2px solid #10B981' : '2px solid #E5E7EB',
                          backgroundColor: selected.time === t ? '#10B981' : 'white',
                          color: selected.time === t ? 'white' : '#374151',
                          cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, transition: 'all 0.2s',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button className="btn-mint-outline" style={{ fontSize: '0.875rem' }} onClick={() => setStep(1)}>
                  ← {pick({ en: 'Back', ar: 'رجوع' })}
                </button>
                <button
                  className="btn-coral"
                  disabled={!selected.date || !selected.time}
                  onClick={() => setStep(3)}
                  style={{ opacity: (!selected.date || !selected.time) ? 0.5 : 1 }}
                >
                  {pick({ en: 'Continue', ar: 'استمرار' })} →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Patient Info + Confirm */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Form */}
                <div>
                  <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 700, fontSize: '1.2rem', color: '#111827', marginBottom: '1.25rem' }}>
                    {pick({ en: 'Your Information', ar: 'معلوماتك' })}
                  </h2>
                  <form onSubmit={handleConfirm} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {[
                      { name: 'name', label: { en: 'Full Name', ar: 'الاسم الكامل' }, required: true },
                      { name: 'phone', label: { en: 'Phone Number', ar: 'رقم الهاتف' }, required: true },
                      { name: 'email', label: { en: 'Email Address', ar: 'البريد الإلكتروني' }, required: true },
                    ].map(f => (
                      <div key={f.name}>
                        <label style={{ display: 'block', fontWeight: 500, fontSize: '0.85rem', color: '#374151', marginBottom: '0.35rem' }}>
                          {pick(f.label)} <span style={{ color: '#F97316' }}>*</span>
                        </label>
                        <input
                          name={f.name}
                          value={form[f.name]}
                          onChange={handleFormChange}
                          required={f.required}
                          style={{
                            width: '100%', padding: '0.7rem 0.875rem', borderRadius: '0.625rem',
                            border: '1.5px solid #E5E7EB', fontSize: '0.875rem', color: '#111827',
                            outline: 'none', fontFamily: 'inherit',
                          }}
                          onFocus={e => e.target.style.borderColor = '#10B981'}
                          onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                        />
                      </div>
                    ))}
                    <div>
                      <label style={{ display: 'block', fontWeight: 500, fontSize: '0.85rem', color: '#374151', marginBottom: '0.35rem' }}>
                        {pick({ en: 'Notes (optional)', ar: 'ملاحظات (اختياري)' })}
                      </label>
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleFormChange}
                        rows={3}
                        style={{
                          width: '100%', padding: '0.7rem 0.875rem', borderRadius: '0.625rem',
                          border: '1.5px solid #E5E7EB', fontSize: '0.875rem', color: '#111827',
                          outline: 'none', fontFamily: 'inherit', resize: 'vertical',
                        }}
                        onFocus={e => e.target.style.borderColor = '#10B981'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                      <button type="button" className="btn-mint-outline" style={{ fontSize: '0.875rem' }} onClick={() => setStep(2)}>
                        ← {pick({ en: 'Back', ar: 'رجوع' })}
                      </button>
                      <button type="submit" className="btn-coral" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                        {loading
                          ? <><span className="spinner" style={{ width: '1.1rem', height: '1.1rem', borderWidth: '2px' }} /> {pick({ en: 'Confirming…', ar: 'جارٍ التأكيد…' })}</>
                          : pick({ en: 'Confirm Appointment', ar: 'تأكيد الموعد' })
                        }
                      </button>
                    </div>
                  </form>
                </div>

                {/* Summary */}
                <div>
                  <h3 style={{ fontFamily: '"DM Sans"', fontWeight: 700, fontSize: '1rem', color: '#111827', marginBottom: '1rem' }}>
                    {pick({ en: 'Booking Summary', ar: 'ملخص الحجز' })}
                  </h3>
                  <div style={{ backgroundColor: '#F9FAFB', borderRadius: '1rem', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {[
                      { label: { en: 'Service', ar: 'الخدمة' }, value: selected.service ? pick({ en: selected.service.en, ar: selected.service.ar }) : '—' },
                      { label: { en: 'Doctor', ar: 'الطبيب' }, value: selected.doctor ? pick(selected.doctor.name) : pick({ en: 'Any Available', ar: 'أي طبيب متاح' }) },
                      { label: { en: 'Date', ar: 'التاريخ' }, value: selected.date ? formatDate(selected.date) : '—' },
                      { label: { en: 'Time', ar: 'الوقت' }, value: selected.time || '—' },
                      { label: { en: 'Price', ar: 'السعر' }, value: selected.service?.price || '—' },
                    ].map((row, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.625rem', borderBottom: i < 4 ? '1px solid #E5E7EB' : 'none' }}>
                        <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>{pick(row.label)}</span>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ backgroundColor: '#D1FAE5', borderRadius: '0.75rem', padding: '1rem', marginTop: '1rem' }}>
                    <p style={{ color: '#065F46', fontSize: '0.82rem', lineHeight: 1.5 }}>
                      ✅ {pick({ en: 'Free cancellation up to 24 hours before your appointment. Confirmation email will be sent shortly.', ar: 'إلغاء مجاني حتى 24 ساعة قبل موعدك. سيُرسل بريد إلكتروني للتأكيد قريباً.' })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function formatDateShort(d) {
  return d.toLocaleDateString('en-AE', { weekday: 'short', day: 'numeric', month: 'short' })
}
