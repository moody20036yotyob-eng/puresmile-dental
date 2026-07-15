import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { useSEO } from '../hooks/useSEO'

const SERVICES = [
  { icon: '🦷', en: 'General Dentistry', ar: 'طب الأسنان العام', desc: { en: 'Comprehensive check-ups, fillings, extractions and preventive care for your whole family.', ar: 'فحوصات شاملة وحشوات وخلع وعناية وقائية لعائلتك بأكملها.' } },
  { icon: '✨', en: 'Cosmetic Dentistry', ar: 'طب الأسنان التجميلي', desc: { en: 'Veneers, bonding, whitening and smile makeovers to give you the perfect smile.', ar: 'قشور بورسلين وحشوات تجميلية وتبييض وجلسات تجميل الابتسامة.' } },
  { icon: '📐', en: 'Orthodontics', ar: 'تقويم الأسنان', desc: { en: 'Traditional braces and clear aligners for children, teens and adults.', ar: 'تقويم تقليدي وطواقم شفافة للأطفال والمراهقين والبالغين.' } },
  { icon: '🔩', en: 'Dental Implants', ar: 'زراعة الأسنان', desc: { en: 'Permanent, natural-looking tooth replacements with the latest implant technology.', ar: 'بدائل دائمة وطبيعية المظهر للأسنان بأحدث تقنيات الزراعة.' } },
  { icon: '🌟', en: 'Teeth Whitening', ar: 'تبييض الأسنان', desc: { en: 'Professional in-clinic or take-home whitening for a noticeably brighter smile.', ar: 'تبييض احترافي في العيادة أو منزلي لابتسامة أكثر إشراقاً.' } },
  { icon: '👶', en: 'Pediatric Dentistry', ar: 'طب أسنان الأطفال', desc: { en: 'Gentle, fun dental care designed specifically for our youngest patients.', ar: 'رعاية أسنان لطيفة وممتعة مصممة خصيصاً لأصغر مرضانا.' } },
]

const STATS = [
  { value: '15+', label: { en: 'Years Experience', ar: 'سنوات خبرة' } },
  { value: '12K+', label: { en: 'Happy Patients', ar: 'مريض سعيد' } },
  { value: '8', label: { en: 'Expert Doctors', ar: 'طبيب متخصص' } },
  { value: '4.9★', label: { en: 'Average Rating', ar: 'متوسط التقييم' } },
]

const DOCTORS = [
  { name: { en: 'Dr. Sarah Mitchell', ar: 'د. سارة ميتشل' }, specialty: { en: 'Cosmetic Dentist', ar: 'طبيبة أسنان تجميلية' }, bio: { en: 'Harvard-trained cosmetic dentist with 12 years crafting dream smiles in Dubai.', ar: 'طبيبة تجميل حاصلة على تدريب من هارفارد مع 12 عاماً من الخبرة في تجميل الابتسامات.' }, emoji: '👩‍⚕️' },
  { name: { en: 'Dr. Ahmed Al-Rashid', ar: 'د. أحمد الراشد' }, specialty: { en: 'Orthodontist', ar: 'طبيب تقويم أسنان' }, bio: { en: 'Specialist in Invisalign and traditional braces. Over 3,000 successful cases.', ar: 'متخصص في Invisalign والتقويم التقليدي. أكثر من 3000 حالة ناجحة.' }, emoji: '👨‍⚕️' },
  { name: { en: 'Dr. Priya Sharma', ar: 'د. بريا شارما' }, specialty: { en: 'Implant Surgeon', ar: 'جراحة زراعة الأسنان' }, bio: { en: 'Fellowship in oral implantology. Minimally invasive techniques for lasting results.', ar: 'زمالة في زراعة الأسنان الفموية. تقنيات طفيفة التوغل لنتائج دائمة.' }, emoji: '👩‍⚕️' },
]

const TESTIMONIALS = [
  { name: { en: 'Emma R.', ar: 'إيما ر.' }, text: { en: 'Absolutely transformed my smile! The team was so gentle and professional. I was terrified of dentists before — now I actually look forward to my visits.', ar: 'غيّرت ابتسامتي تماماً! كان الفريق لطيفاً ومحترفاً للغاية. كنت خائفة من أطباء الأسنان من قبل — الآن أتطلع فعلاً لزياراتي.' }, rating: 5 },
  { name: { en: 'Mohammed K.', ar: 'محمد ك.' }, text: { en: 'Best dental experience in Dubai. Modern facilities, no waiting, and Dr. Ahmed is a true artist with orthodontics. My Invisalign results are incredible.', ar: 'أفضل تجربة لطب الأسنان في دبي. مرافق حديثة وبلا انتظار، والدكتور أحمد فنان حقيقي في التقويم. نتائج الـ Invisalign رائعة.' }, rating: 5 },
  { name: { en: 'Sophie L.', ar: 'صوفي ل.' }, text: { en: 'Brought my 5-year-old here and she actually enjoyed her first dental visit! The pediatric team made everything so fun and stress-free.', ar: 'أحضرت طفلتي البالغة من العمر 5 سنوات وقد استمتعت بزيارتها الأولى لطبيب الأسنان! جعل فريق الأطفال كل شيء ممتعاً.' }, rating: 5 },
  { name: { en: 'James T.', ar: 'جيمس ت.' }, text: { en: 'Had a dental implant done by Dr. Priya. The procedure was painless and the result looks completely natural. Couldn\'t be happier!', ar: 'أجريت زراعة سن مع الدكتورة بريا. كانت العملية غير مؤلمة والنتيجة تبدو طبيعية تماماً.' }, rating: 5 },
]

function WaveDivider({ color = '#F9FAFB', flip = false }) {
  return (
    <div className="wave-divider" style={{ transform: flip ? 'scaleX(-1)' : 'none' }}>
      <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ height: 60 }}>
        <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill={color} />
      </svg>
    </div>
  )
}

export default function Home() {
  const { pick, lang } = useLang()
  const [toothBounce, setToothBounce] = useState(false)
  useSEO({
    title: pick({ en: 'Best Dental Clinic in Dubai', ar: 'أفضل عيادة أسنان في دبي' }),
    description: pick({ en: 'PureSmile Dental — Dubai\'s #1 rated dental clinic in Business Bay. Cosmetic dentistry, implants, Invisalign & more. Book a free consultation today.', ar: 'PureSmile Dental — العيادة الأولى في دبي للأسنان التجميلية والزراعة وانفيزيلاين وأكثر. احجز استشارة مجانية اليوم.' }),
    canonical: 'https://puresmile.ae/',
    lang,
  })

  useEffect(() => {
    const id = setInterval(() => setToothBounce(b => !b), 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <div>
      {/* HERO */}
      <section style={{ backgroundColor: '#F9FAFB', paddingTop: '4rem', paddingBottom: '0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pb-16">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <span className="section-badge">{pick({ en: '🏆 #1 Rated Clinic in Dubai', ar: '🏆 العيادة الأولى في دبي' })}</span>
              <h1 style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 5vw, 3.25rem)', color: '#111827', lineHeight: 1.15, marginBottom: '1.25rem' }}>
                {pick({ en: <>Your Perfect Smile<br /><span style={{ color: '#10B981' }}>Starts Here</span></>, ar: <>ابتسامتك المثالية<br /><span style={{ color: '#10B981' }}>تبدأ هنا</span></> })}
              </h1>
              <p style={{ color: '#6B7280', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '480px', marginBottom: '2rem' }}>
                {pick({
                  en: 'Experience world-class dental care at PureSmile Dental — where cutting-edge technology meets compassionate care in the heart of Dubai.',
                  ar: 'اختبر رعاية أسنان عالمية المستوى في PureSmile Dental — حيث تلتقي التكنولوجيا المتطورة بالرعاية الرحيمة في قلب دبي.',
                })}
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/booking" className="btn-coral">{pick({ en: 'Book Free Consultation', ar: 'احجز استشارة مجانية' })}</Link>
                <Link to="/services" className="btn-mint-outline">{pick({ en: 'Explore Services', ar: 'استكشف الخدمات' })}</Link>
              </div>

              {/* Mini stats */}
              <div className="flex flex-wrap gap-6 mt-8">
                {STATS.map((s, i) => (
                  <div key={i}>
                    <div style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 800, fontSize: '1.5rem', color: '#10B981' }}>{s.value}</div>
                    <div style={{ color: '#6B7280', fontSize: '0.8rem' }}>{pick(s.label)}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — Hero visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              <div style={{ position: 'relative', width: '380px', height: '380px' }}>
                {/* Main circle */}
                <div style={{
                  width: '320px', height: '320px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                  position: 'absolute', top: '30px', left: '30px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <motion.span
                    animate={{ y: toothBounce ? -12 : 0, rotate: toothBounce ? 5 : -5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    style={{ fontSize: '8rem', userSelect: 'none' }}
                  >
                    🦷
                  </motion.span>
                </div>

                {/* Floating cards */}
                <motion.div
                  animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
                  style={{
                    position: 'absolute', top: '0', left: '-10px',
                    backgroundColor: 'white', borderRadius: '1rem',
                    padding: '0.75rem 1rem', boxShadow: '0 4px 20px rgba(16,185,129,0.15)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>⭐</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827' }}>4.9 / 5.0</div>
                    <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>{pick({ en: '1,200+ reviews', ar: '+1200 تقييم' })}</div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 8, 0] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                  style={{
                    position: 'absolute', bottom: '20px', right: '-10px',
                    backgroundColor: 'white', borderRadius: '1rem',
                    padding: '0.75rem 1rem', boxShadow: '0 4px 20px rgba(16,185,129,0.15)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>✅</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827' }}>{pick({ en: 'Pain-Free', ar: 'بلا ألم' })}</div>
                    <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>{pick({ en: 'Guaranteed', ar: 'مضمون' })}</div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  style={{
                    position: 'absolute', bottom: '80px', left: '-20px',
                    backgroundColor: '#10B981', borderRadius: '1rem',
                    padding: '0.6rem 0.9rem', boxShadow: '0 4px 20px rgba(16,185,129,0.3)',
                    color: 'white',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>12,000+</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.85 }}>{pick({ en: 'Patients', ar: 'مريض' })}</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
        <WaveDivider color="white" />
      </section>

      {/* SERVICES */}
      <section style={{ backgroundColor: 'white', padding: '5rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-badge">{pick({ en: 'What We Offer', ar: 'ما نقدمه' })}</span>
            <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#111827' }}>
              {pick({ en: 'Comprehensive Dental Services', ar: 'خدمات أسنان شاملة' })}
            </h2>
            <p style={{ color: '#6B7280', marginTop: '0.75rem', maxWidth: '480px', margin: '0.75rem auto 0' }}>
              {pick({ en: 'Everything your smile needs under one roof, delivered by specialists.', ar: 'كل ما تحتاجه ابتسامتك تحت سقف واحد، يقدمه متخصصون.' })}
            </p>
          </div>

          {/* Home Services: "Icon-Float" cards — large mint circle icon, coral bottom link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8, boxShadow: '0 16px 48px rgba(16,185,129,0.14)' }}
                style={{
                  backgroundColor: 'white', borderRadius: '1.25rem',
                  padding: '0', cursor: 'pointer', overflow: 'hidden',
                  boxShadow: '0 2px 16px rgba(17,24,39,0.06)',
                  transition: 'box-shadow 0.25s, transform 0.25s',
                }}
              >
                {/* Colored top strip */}
                <div style={{
                  background: i % 3 === 0
                    ? 'linear-gradient(135deg,#D1FAE5,#A7F3D0)'
                    : i % 3 === 1
                    ? 'linear-gradient(135deg,#FEF3C7,#FDE68A)'
                    : 'linear-gradient(135deg,#E0E7FF,#C7D2FE)',
                  padding: '1.5rem 1.75rem 1rem',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                }}>
                  <div style={{
                    width: '3.5rem', height: '3.5rem', borderRadius: '1rem',
                    backgroundColor: 'white', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.75rem',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  }}>
                    {s.icon}
                  </div>
                  <h3 style={{ fontFamily: '"DM Sans"', fontWeight: 700, fontSize: '1.05rem', color: '#111827' }}>
                    {pick({ en: s.en, ar: s.ar })}
                  </h3>
                </div>
                <div style={{ padding: '1rem 1.75rem 1.5rem' }}>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                    {pick(s.desc)}
                  </p>
                  <Link to="/booking" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                    backgroundColor: '#FFF7ED', color: '#F97316',
                    fontWeight: 600, fontSize: '0.82rem', textDecoration: 'none',
                    padding: '0.4rem 0.9rem', borderRadius: '9999px',
                    border: '1.5px solid #FED7AA',
                  }}>
                    {pick({ en: 'Book Now', ar: 'احجز الآن' })} →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider color="#F9FAFB" />

      {/* WHY CHOOSE US */}
      <section style={{ backgroundColor: '#F9FAFB', padding: '5rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="section-badge">{pick({ en: 'Why PureSmile?', ar: 'لماذا PureSmile؟' })}</span>
              <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', color: '#111827', marginBottom: '1.5rem' }}>
                {pick({ en: 'A Different Kind of Dental Clinic', ar: 'عيادة أسنان من نوع مختلف' })}
              </h2>
              {[
                { icon: '🔬', en: 'Latest Technology', ar: 'أحدث التقنيات', desc: { en: 'Digital X-rays, 3D scanning, CAD/CAM same-day crowns.', ar: 'أشعة رقمية، مسح ثلاثي الأبعاد، تيجان يومية CAD/CAM.' } },
                { icon: '💚', en: 'Gentle & Caring', ar: 'لطيفون ومهتمون', desc: { en: 'We treat dental anxiety seriously with sedation options.', ar: 'نأخذ قلق طب الأسنان بجدية مع خيارات التخدير.' } },
                { icon: '🌍', en: 'Multilingual Team', ar: 'فريق متعدد اللغات', desc: { en: 'Our team speaks English, Arabic, Hindi, French & more.', ar: 'فريقنا يتحدث الإنجليزية والعربية والهندية والفرنسية وأكثر.' } },
                { icon: '💳', en: 'Flexible Payment', ar: 'دفع مرن', desc: { en: 'Insurance accepted + 0% installment plans available.', ar: 'يقبل التأمين + خطط تقسيط بفائدة 0٪.' } },
                { icon: '⏱️', en: 'No Long Waits', ar: 'بلا انتظار طويل', desc: { en: 'Online booking + punctual appointments — we respect your time.', ar: 'حجز إلكتروني + مواعيد دقيقة — نحترم وقتك.' } },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-start' }}
                >
                  <div style={{
                    width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
                    backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0,
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem' }}>{pick({ en: item.en, ar: item.ar })}</div>
                    <div style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '0.2rem' }}>{pick(item.desc)}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              style={{
                backgroundColor: 'white', borderRadius: '1.5rem',
                padding: '2.5rem', boxShadow: '0 8px 40px rgba(16,185,129,0.12)',
                textAlign: 'center',
              }}
            >
              <div className="grid grid-cols-2 gap-6">
                {STATS.map((s, i) => (
                  <div key={i} style={{ padding: '1.5rem', backgroundColor: '#F9FAFB', borderRadius: '1rem' }}>
                    <div style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: '2rem', color: '#10B981' }}>{s.value}</div>
                    <div style={{ color: '#6B7280', fontSize: '0.85rem', marginTop: '0.25rem' }}>{pick(s.label)}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#D1FAE5', borderRadius: '1rem' }}>
                <p style={{ color: '#065F46', fontWeight: 600, fontSize: '0.95rem' }}>
                  {pick({ en: '🏆 Dubai Health Authority Certified', ar: '🏆 معتمدة من هيئة الصحة في دبي' })}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <WaveDivider color="white" />

      {/* DOCTORS PREVIEW */}
      <section style={{ backgroundColor: 'white', padding: '5rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-badge">{pick({ en: 'Our Experts', ar: 'خبراؤنا' })}</span>
            <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#111827' }}>
              {pick({ en: 'Meet Our Specialists', ar: 'تعرف على متخصصينا' })}
            </h2>
          </div>

          {/* Home Doctors: "Circle Avatar" cards — centered emoji circle, name + specialty below */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {DOCTORS.map((doc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                style={{
                  backgroundColor: 'white', borderRadius: '1.5rem',
                  boxShadow: '0 2px 16px rgba(17,24,39,0.06)',
                  padding: '2rem 1.5rem', textAlign: 'center',
                  position: 'relative', overflow: 'hidden',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 40px rgba(16,185,129,0.14)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 16px rgba(17,24,39,0.06)'}
              >
                {/* Decorative arc */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: '80px',
                  background: 'linear-gradient(135deg,#D1FAE5,#A7F3D0)', borderRadius: '1.5rem 1.5rem 50% 50%',
                }} />
                {/* Avatar circle */}
                <div style={{
                  width: '90px', height: '90px', borderRadius: '50%',
                  background: 'white', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '3.5rem',
                  margin: '0 auto 1rem', position: 'relative', zIndex: 1,
                  boxShadow: '0 4px 20px rgba(16,185,129,0.2)',
                  border: '3px solid white',
                }}>
                  {doc.emoji}
                </div>
                <h3 style={{ fontFamily: '"DM Sans"', fontWeight: 700, color: '#111827', fontSize: '1rem', marginBottom: '0.3rem' }}>
                  {pick(doc.name)}
                </h3>
                <span style={{
                  display: 'inline-block', backgroundColor: '#D1FAE5', color: '#065F46',
                  padding: '0.2rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem',
                  fontWeight: 600, marginBottom: '0.875rem',
                }}>
                  {pick(doc.specialty)}
                </span>
                <p style={{ color: '#6B7280', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>{pick(doc.bio)}</p>
                <Link to="/booking" className="btn-coral" style={{ fontSize: '0.8rem', padding: '0.45rem 1.1rem', justifyContent: 'center', width: '100%' }}>
                  {pick({ en: 'Book Appointment', ar: 'احجز موعداً' })}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/about" className="btn-mint-outline">{pick({ en: 'Meet All Doctors', ar: 'تعرف على جميع الأطباء' })}</Link>
          </div>
        </div>
      </section>

      <WaveDivider color="#F9FAFB" />

      {/* TESTIMONIALS */}
      <section style={{ backgroundColor: '#F9FAFB', padding: '5rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="section-badge">{pick({ en: 'Patient Stories', ar: 'قصص المرضى' })}</span>
            <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#111827' }}>
              {pick({ en: 'What Our Patients Say', ar: 'ماذا يقول مرضانا' })}
            </h2>
          </div>

          <div className="scroll-x-container">
            <div style={{ display: 'flex', gap: '1.5rem', minWidth: 'max-content', padding: '0.5rem 0.25rem 1rem' }}>
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    width: '320px', backgroundColor: 'white', borderRadius: '1rem',
                    padding: '1.5rem', boxShadow: '0 2px 16px rgba(17,24,39,0.06)',
                    flexShrink: 0,
                  }}
                >
                  <div style={{ color: '#F59E0B', fontSize: '1rem', marginBottom: '0.75rem' }}>
                    {'★'.repeat(t.rating)}
                  </div>
                  <p style={{ color: '#374151', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    "{pick(t.text)}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '2.5rem', height: '2.5rem', borderRadius: '50%',
                      backgroundColor: '#D1FAE5', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontWeight: 700, color: '#065F46',
                    }}>
                      {pick(t.name)[0]}
                    </div>
                    <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>{pick(t.name)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WaveDivider color="white" />

      {/* CTA BANNER */}
      <section style={{ backgroundColor: 'white', padding: '5rem 0' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="cta-mint-bg"
            style={{ borderRadius: '1.5rem', padding: '3rem 2rem', textAlign: 'center' }}
          >
            <span style={{ fontSize: '3rem' }}>😁</span>
            <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#111827', margin: '1rem 0 0.75rem' }}>
              {pick({ en: 'Ready for Your Dream Smile?', ar: 'هل أنت مستعد لابتسامة أحلامك؟' })}
            </h2>
            <p style={{ color: '#6B7280', marginBottom: '1.75rem', maxWidth: '480px', margin: '0 auto 1.75rem' }}>
              {pick({
                en: 'Book a free consultation today and let our experts design your perfect smile. First visit includes a full exam and digital X-rays.',
                ar: 'احجز استشارة مجانية اليوم ودع خبراءنا يصممون ابتسامتك المثالية. الزيارة الأولى تشمل فحصاً كاملاً وأشعة رقمية.',
              })}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/booking" className="btn-coral" style={{ fontSize: '1rem', padding: '0.875rem 2.25rem' }}>
                {pick({ en: 'Book Free Consultation', ar: 'احجز استشارة مجانية' })}
              </Link>
              <a href="tel:+97141234567" className="btn-mint-outline" style={{ fontSize: '1rem', padding: '0.875rem 2.25rem' }}>
                📞 +971 4 123 4567
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
