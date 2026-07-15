import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { useSEO } from '../hooks/useSEO'

const STATS = [
  { value: '2009', label: { en: 'Founded', ar: 'تأسست' } },
  { value: '15+', label: { en: 'Years of Excellence', ar: 'سنوات من التميز' } },
  { value: '12K+', label: { en: 'Patients Treated', ar: 'مريض تم علاجه' } },
  { value: '8', label: { en: 'Specialist Doctors', ar: 'طبيب متخصص' } },
]

const VALUES = [
  { icon: '❤️', en: 'Patient First', ar: 'المريض أولاً', desc: { en: 'Every decision we make is centered around your comfort, safety, and wellbeing.', ar: 'كل قرار نتخذه يتمحور حول راحتك وسلامتك ورفاهيتك.' } },
  { icon: '🔬', en: 'Clinical Excellence', ar: 'التميز السريري', desc: { en: 'We invest in the latest technology and continuing education to deliver best-in-class care.', ar: 'نستثمر في أحدث التقنيات والتعليم المستمر لتقديم أفضل رعاية في فئتها.' } },
  { icon: '🤝', en: 'Transparency', ar: 'الشفافية', desc: { en: 'Clear pricing, honest diagnoses, no surprise bills — ever.', ar: 'أسعار واضحة وتشخيصات صادقة وبلا فواتير مفاجئة أبداً.' } },
  { icon: '♻️', en: 'Sustainability', ar: 'الاستدامة', desc: { en: 'Digital records, eco-friendly materials, and reduced single-use plastics.', ar: 'سجلات رقمية ومواد صديقة للبيئة وتقليل البلاستيك أحادي الاستخدام.' } },
  { icon: '🌍', en: 'Inclusivity', ar: 'الشمولية', desc: { en: 'Welcoming patients of all backgrounds, ages, and abilities — Dubai\'s most diverse clinic.', ar: 'ترحيب بالمرضى من جميع الخلفيات والأعمار والقدرات.' } },
  { icon: '🏆', en: 'Continuous Growth', ar: 'النمو المستمر', desc: { en: 'Regular training, certifications, and conferences keep our team at the leading edge.', ar: 'التدريب المنتظم والشهادات والمؤتمرات تبقي فريقنا في طليعة المجال.' } },
]

const DOCTORS = [
  { name: { en: 'Dr. Sarah Mitchell', ar: 'د. سارة ميتشل' }, specialty: { en: 'Cosmetic Dentist & Clinical Director', ar: 'طبيبة أسنان تجميلية ومديرة سريرية' }, bio: { en: 'Dr. Mitchell graduated from Harvard School of Dental Medicine and completed her fellowship in Aesthetic Dentistry at NYU. She has been practicing in Dubai since 2012 and has crafted over 4,000 smile makeovers. She is a certified Invisalign provider and Zoom! whitening specialist.', ar: 'تخرجت الدكتورة ميتشل من كلية طب الأسنان بجامعة هارفارد وأكملت زمالتها في طب الأسنان الجمالي في جامعة نيويورك. تمارس عملها في دبي منذ 2012 وقدمت أكثر من 4000 ابتسامة متحولة.' }, emoji: '👩‍⚕️', tags: [{ en: 'Veneers', ar: 'قشور' }, { en: 'Whitening', ar: 'تبييض' }, { en: 'Smile Design', ar: 'تصميم ابتسامة' }] },
  { name: { en: 'Dr. Ahmed Al-Rashid', ar: 'د. أحمد الراشد' }, specialty: { en: 'Orthodontist', ar: 'طبيب تقويم أسنان' }, bio: { en: 'Dr. Al-Rashid is a board-certified orthodontist trained at the University of Melbourne. He specializes in Invisalign, self-ligating brackets, and complex bite correction. Diamond Invisalign Provider with over 3,000 aligner cases completed.', ar: 'الدكتور الراشد أخصائي تقويم معتمد تدرّب في جامعة ملبورن. متخصص في Invisalign والبراكيت ذاتي الربط وتصحيح العضة المعقدة. مزود Invisalign الماسي مع أكثر من 3000 حالة.' }, emoji: '👨‍⚕️', tags: [{ en: 'Invisalign', ar: 'انفيزيلاين' }, { en: 'Braces', ar: 'تقويم' }, { en: 'Bite Correction', ar: 'تصحيح عضة' }] },
  { name: { en: 'Dr. Priya Sharma', ar: 'د. بريا شارما' }, specialty: { en: 'Implant Surgeon & Periodontist', ar: 'جراحة زراعة وأمراض اللثة' }, bio: { en: 'Dr. Sharma holds a Masters in Oral Implantology from the University of Frankfurt and completed advanced training in All-on-4 and zygomatic implants. She brings minimally invasive techniques that ensure faster healing and longer-lasting results.', ar: 'تحمل الدكتورة شارما ماجستير في زراعة الأسنان الفموية من جامعة فرانكفورت وأكملت تدريباً متقدماً في All-on-4 وزراعات الوجني.' }, emoji: '👩‍⚕️', tags: [{ en: 'Implants', ar: 'زراعة' }, { en: 'Gum Surgery', ar: 'جراحة اللثة' }, { en: 'All-on-4', ar: 'أول أون 4' }] },
  { name: { en: 'Dr. Khalid Hassan', ar: 'د. خالد حسان' }, specialty: { en: 'Endodontist (Root Canal)', ar: 'طبيب علاج جذور الأسنان' }, bio: { en: 'Dr. Hassan is renowned for painless root canal treatments using microscope-aided endodontics. He trained in Germany and has published research on regenerative endodontic procedures.', ar: 'الدكتور حسان مشهور بعلاجات جذور الأسنان غير المؤلمة باستخدام طب الجذور بالمجهر. تدرّب في ألمانيا ونشر أبحاثاً في علاج الجذور التجديدي.' }, emoji: '👨‍⚕️', tags: [{ en: 'Root Canal', ar: 'علاج عصب' }, { en: 'Microscopy', ar: 'مجهر' }, { en: 'Regenerative', ar: 'تجديدي' }] },
]

const TIMELINE = [
  { year: '2009', en: 'PureSmile opens its first clinic in Jumeirah, Dubai with 3 dentists.', ar: 'افتتاح عيادة PureSmile الأولى في جميرا، دبي مع 3 أطباء.' },
  { year: '2013', en: 'Expanded to Business Bay. Introduced digital 3D scanning technology.', ar: 'توسع إلى الخليج التجاري. إدخال تقنية المسح الثلاثي الأبعاد الرقمي.' },
  { year: '2016', en: 'Became a Diamond Invisalign provider. Launched pediatric dentistry wing.', ar: 'أصبح مزود Invisalign الماسي. إطلاق جناح طب أسنان الأطفال.' },
  { year: '2019', en: 'Won Dubai Healthcare Excellence Award. Opened second branch in DIFC.', ar: 'فاز بجائزة التميز الصحي في دبي. افتتح فرعاً ثانياً في مركز دبي المالي الدولي.' },
  { year: '2022', en: 'Introduced AI-powered smile design and same-day CAD/CAM crowns.', ar: 'أدخل تصميم الابتسامة بالذكاء الاصطناعي والتيجان في نفس اليوم CAD/CAM.' },
  { year: '2025', en: 'Now serving 12,000+ patients annually with 8 specialist dentists.', ar: 'يخدم الآن أكثر من 12000 مريض سنوياً مع 8 أطباء أسنان متخصصين.' },
]

export default function About() {
  const { pick, lang } = useLang()
  useSEO({
    title: pick({ en: 'About PureSmile Dental — Our Story & Doctors in Dubai', ar: 'عن PureSmile Dental — قصتنا وأطباؤنا في دبي' }),
    description: pick({ en: 'Meet Dubai\'s most trusted dental team. 15+ years of excellence, 12,000+ patients, 8 specialist doctors. DHA certified clinic in Business Bay.', ar: 'تعرف على فريق الأسنان الأكثر ثقة في دبي. أكثر من 15 عاماً من التميز و12000 مريض و8 أطباء متخصصين.' }),
    canonical: 'https://puresmile.ae/about',
    lang,
  })

  return (
    <div style={{ backgroundColor: '#F9FAFB' }}>
      {/* Mission Hero */}
      <section style={{ backgroundColor: 'white', padding: '4rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <span className="section-badge">{pick({ en: 'Our Story', ar: 'قصتنا' })}</span>
              <h1 style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', color: '#111827', marginBottom: '1.25rem', lineHeight: 1.15 }}>
                {pick({ en: <>We Believe Everyone Deserves<br /><span style={{ color: '#10B981' }}>a Perfect Smile</span></>, ar: <>نؤمن أن كل شخص يستحق<br /><span style={{ color: '#10B981' }}>ابتسامة مثالية</span></> })}
              </h1>
              <p style={{ color: '#6B7280', lineHeight: 1.8, marginBottom: '1rem', fontSize: '1rem' }}>
                {pick({
                  en: 'Founded in 2009 in Dubai, PureSmile Dental was built on a simple promise: exceptional dental care that makes every patient feel heard, comfortable, and confident.',
                  ar: 'تأسست عيادة PureSmile Dental عام 2009 في دبي على وعد بسيط: رعاية أسنان استثنائية تجعل كل مريض يشعر بأنه مسموع ومرتاح وواثق من نفسه.',
                })}
              </p>
              <p style={{ color: '#6B7280', lineHeight: 1.8, fontSize: '1rem' }}>
                {pick({
                  en: 'Today, we\'re proud to serve Dubai\'s most diverse community with the latest technology, a team of internationally trained specialists, and a culture of genuine warmth.',
                  ar: 'اليوم، نفخر بخدمة أكثر مجتمعات دبي تنوعاً بأحدث التقنيات وفريق من المتخصصين المدربين دولياً وثقافة الدفء الحقيقي.',
                })}
              </p>
              <Link to="/booking" className="btn-coral" style={{ marginTop: '1.5rem', display: 'inline-flex' }}>
                {pick({ en: 'Book a Visit', ar: 'احجز زيارة' })}
              </Link>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <div className="img-placeholder" style={{ height: '360px', borderRadius: '1.5rem', fontSize: '8rem' }}>
                🏥
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section style={{ backgroundColor: '#10B981', padding: '2.5rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {STATS.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: '2rem', color: 'white' }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{pick(s.label)}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ backgroundColor: '#F9FAFB', padding: '5rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-badge">{pick({ en: 'What We Stand For', ar: 'ما نقف من أجله' })}</span>
            <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', color: '#111827' }}>
              {pick({ en: 'Our Core Values', ar: 'قيمنا الأساسية' })}
            </h2>
          </div>
          {/* Values: "Horizontal Feature" cards — icon square left, text right, colored left border */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VALUES.map((v, i) => {
              const colors = ['#10B981','#F97316','#6366F1','#EC4899','#14B8A6','#F59E0B']
              const bgs = ['#D1FAE5','#FED7AA','#E0E7FF','#FCE7F3','#CCFBF1','#FEF3C7']
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ x: 4 }}
                  style={{
                    backgroundColor: 'white', borderRadius: '1rem',
                    padding: '1.25rem 1.5rem',
                    boxShadow: '0 2px 12px rgba(17,24,39,0.05)',
                    display: 'flex', alignItems: 'center', gap: '1.1rem',
                    borderLeft: `4px solid ${colors[i]}`,
                    transition: 'transform 0.2s',
                  }}
                >
                  <div style={{
                    width: '3rem', height: '3rem', borderRadius: '0.75rem',
                    backgroundColor: bgs[i], display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0,
                  }}>
                    {v.icon}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: '"DM Sans"', fontWeight: 700, color: '#111827', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
                      {pick({ en: v.en, ar: v.ar })}
                    </h3>
                    <p style={{ color: '#6B7280', fontSize: '0.82rem', lineHeight: 1.55 }}>{pick(v.desc)}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ backgroundColor: 'white', padding: '5rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-badge">{pick({ en: 'Our Journey', ar: 'رحلتنا' })}</span>
            <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', color: '#111827' }}>
              {pick({ en: 'Milestones & Growth', ar: 'المعالم والنمو' })}
            </h2>
          </div>

          <div className="scroll-x-container">
            <div style={{ display: 'flex', gap: '0', minWidth: 'max-content', position: 'relative', padding: '3rem 0' }}>
              <div className="timeline-line" />
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    width: '200px', flexShrink: 0,
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', position: 'relative',
                    paddingTop: i % 2 === 0 ? '0' : '8rem',
                    paddingBottom: i % 2 === 0 ? '8rem' : '0',
                  }}
                >
                  <div style={{
                    width: '1rem', height: '1rem', borderRadius: '50%',
                    backgroundColor: '#10B981', border: '3px solid white',
                    boxShadow: '0 0 0 3px #D1FAE5',
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                  }} />
                  <div style={{
                    backgroundColor: 'white', borderRadius: '0.75rem',
                    padding: '1rem', boxShadow: '0 2px 16px rgba(17,24,39,0.08)',
                    width: '170px', textAlign: 'center',
                    position: 'absolute',
                    [i % 2 === 0 ? 'bottom' : 'top']: 'calc(50% + 1.5rem)',
                  }}>
                    <div style={{ fontFamily: '"DM Sans"', fontWeight: 800, color: '#10B981', fontSize: '1.1rem', marginBottom: '0.4rem' }}>{item.year}</div>
                    <p style={{ color: '#6B7280', fontSize: '0.78rem', lineHeight: 1.5 }}>{pick({ en: item.en, ar: item.ar })}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctor cards */}
      <section style={{ backgroundColor: '#F9FAFB', padding: '5rem 0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="section-badge">{pick({ en: 'Our Team', ar: 'فريقنا' })}</span>
            <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: 'clamp(1.6rem, 3vw, 2.25rem)', color: '#111827' }}>
              {pick({ en: 'Meet Your Doctors', ar: 'تعرف على أطبائك' })}
            </h2>
          </div>

          {/* About Doctors: "Ribbon Badge" cards — colored top ribbon, avatar overlapping, tags below */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOCTORS.map((doc, i) => {
              const ribbonColors = ['#10B981','#6366F1','#F97316','#EC4899']
              const ribbonBgs   = ['#D1FAE5','#E0E7FF','#FED7AA','#FCE7F3']
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(16,185,129,0.14)' }}
                  style={{
                    backgroundColor: 'white', borderRadius: '1.25rem',
                    boxShadow: '0 2px 16px rgba(17,24,39,0.06)',
                    overflow: 'hidden', transition: 'transform 0.25s, box-shadow 0.25s',
                    paddingBottom: '1.25rem',
                  }}
                >
                  {/* Ribbon header */}
                  <div style={{
                    backgroundColor: ribbonBgs[i], padding: '1.5rem 1rem 2.5rem',
                    textAlign: 'center', position: 'relative',
                  }}>
                    <div style={{
                      display: 'inline-block', padding: '0.25rem 0.9rem', borderRadius: '9999px',
                      backgroundColor: ribbonColors[i], color: 'white',
                      fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.03em',
                      textTransform: 'uppercase', marginBottom: '0.75rem',
                    }}>
                      {pick(doc.specialty)}
                    </div>
                  </div>

                  {/* Avatar overlapping */}
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-2rem', marginBottom: '0.875rem', position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: '72px', height: '72px', borderRadius: '50%',
                      backgroundColor: 'white', border: `3px solid ${ribbonColors[i]}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '2.5rem', boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    }}>
                      {doc.emoji}
                    </div>
                  </div>

                  <div style={{ padding: '0 1.1rem', textAlign: 'center' }}>
                    <h3 style={{ fontFamily: '"DM Sans"', fontWeight: 700, color: '#111827', fontSize: '0.92rem', marginBottom: '0.6rem' }}>
                      {pick(doc.name)}
                    </h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', justifyContent: 'center', marginBottom: '0.875rem' }}>
                      {doc.tags.map((tag, j) => (
                        <span key={j} style={{
                          backgroundColor: '#F9FAFB', color: '#6B7280',
                          padding: '0.18rem 0.55rem', borderRadius: '9999px', fontSize: '0.7rem',
                          border: '1px solid #E5E7EB',
                        }}>
                          {pick(tag)}
                        </span>
                      ))}
                    </div>
                    <Link to="/booking" style={{
                      display: 'inline-block', backgroundColor: ribbonColors[i],
                      color: 'white', padding: '0.4rem 1rem', borderRadius: '9999px',
                      fontWeight: 600, fontSize: '0.75rem', textDecoration: 'none',
                    }}>
                      {pick({ en: 'Book', ar: 'احجز' })}
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
