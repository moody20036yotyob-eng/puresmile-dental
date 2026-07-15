import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { useSEO } from '../hooks/useSEO'

const CATEGORIES = [
  { id: 'all', en: 'All Questions', ar: 'جميع الأسئلة' },
  { id: 'general', en: 'General', ar: 'عام' },
  { id: 'treatment', en: 'Treatments', ar: 'العلاجات' },
  { id: 'cost', en: 'Cost & Insurance', ar: 'التكلفة والتأمين' },
  { id: 'booking', en: 'Booking', ar: 'الحجز' },
]

const FAQS = [
  { id: 1, category: 'general', q: { en: 'How often should I visit the dentist?', ar: 'كم مرة يجب أن أزور طبيب الأسنان؟' }, a: { en: 'We recommend a check-up and professional cleaning every 6 months for most patients. However, patients with gum disease, high cavity risk, or certain medical conditions may need to visit more frequently — typically every 3 to 4 months. Your doctor will advise the right schedule for you.', ar: 'نوصي بفحص وتنظيف احترافي كل 6 أشهر لمعظم المرضى. ومع ذلك، قد يحتاج مرضى أمراض اللثة أو أصحاب خطر التسوس المرتفع إلى زيارات أكثر تكراراً — عادةً كل 3 إلى 4 أشهر.' } },
  { id: 2, category: 'general', q: { en: 'Is PureSmile suitable for people with dental anxiety?', ar: 'هل PureSmile مناسبة للأشخاص الذين يعانون من قلق طب الأسنان؟' }, a: { en: 'Absolutely. We specialize in anxious patients and offer multiple comfort options: sedation dentistry (oral and IV), noise-canceling headphones, aromatherapy, and a no-rush approach. Just tell us about your concerns when booking and we\'ll tailor your visit accordingly.', ar: 'بالتأكيد. نتخصص في المرضى القلقين ونقدم خيارات راحة متعددة: تخدير السن (فموي وريدي)، سماعات عازلة للضوضاء، علاج بالروائح، ونهج غير متسرع.' } },
  { id: 3, category: 'general', q: { en: 'What languages does the PureSmile team speak?', ar: 'ما اللغات التي يتحدثها فريق PureSmile؟' }, a: { en: 'Our team is proud to serve patients in English, Arabic, Hindi, Urdu, French, and Tagalog. Dubai is our home and we reflect its diversity. Just let us know your preferred language when booking.', ar: 'يسعد فريقنا بخدمة المرضى باللغات الإنجليزية والعربية والهندية والأردية والفرنسية والتاغالوغ.' } },
  { id: 4, category: 'treatment', q: { en: 'Is teeth whitening safe?', ar: 'هل تبييض الأسنان آمن؟' }, a: { en: 'Yes, when performed by qualified dental professionals. We use clinically proven concentrations of hydrogen peroxide gel. Some patients experience mild, temporary sensitivity, which resolves within 24–48 hours. We always assess your enamel health before recommending whitening.', ar: 'نعم، عند إجرائه من قِبل متخصصين مؤهلين. نستخدم تركيزات مثبتة سريرياً من جل بيروكسيد الهيدروجين. قد يعاني بعض المرضى من حساسية خفيفة ومؤقتة تزول خلال 24-48 ساعة.' } },
  { id: 5, category: 'treatment', q: { en: 'How long does Invisalign treatment take?', ar: 'كم تستغرق مدة علاج Invisalign؟' }, a: { en: 'Treatment duration varies by case complexity. Mild to moderate alignment cases typically take 6–12 months; more complex cases can take 18–24 months. Your first consultation includes a digital scan and a projected treatment timeline so you know exactly what to expect.', ar: 'تتفاوت مدة العلاج حسب تعقيد الحالة. عادةً تستغرق حالات المحاذاة البسيطة إلى المتوسطة 6-12 شهراً؛ أما الحالات الأكثر تعقيداً فقد تستغرق 18-24 شهراً.' } },
  { id: 6, category: 'treatment', q: { en: 'Are dental implants painful?', ar: 'هل زراعة الأسنان مؤلمة؟' }, a: { en: 'The procedure itself is performed under local anesthesia, so you won\'t feel pain during surgery. Post-operatively, most patients experience mild discomfort for 2–3 days, manageable with over-the-counter pain relief. Our team provides detailed aftercare instructions to ensure smooth healing.', ar: 'يُجرى الإجراء نفسه تحت التخدير الموضعي، لذا لن تشعر بألم أثناء الجراحة. بعد العملية، يعاني معظم المرضى من انزعاج خفيف لمدة 2-3 أيام يمكن إدارته بمسكنات الألم.' } },
  { id: 7, category: 'treatment', q: { en: 'What is the difference between porcelain veneers and composite bonding?', ar: 'ما الفرق بين قشور البورسلين والحشوة المركبة؟' }, a: { en: 'Porcelain veneers are thin custom-made shells crafted in a dental lab — they\'re more durable, stain-resistant, and natural-looking, but require 2 visits and are irreversible. Composite bonding uses tooth-coloured resin applied directly in one visit — more affordable and reversible, but less durable and can stain over time.', ar: 'قشور البورسلين غلاف رفيع مصنوع حسب الطلب في مختبر الأسنان — أكثر متانة ومقاومة للبقع وطبيعية المظهر لكنها تتطلب زيارتين وغير قابلة للعكس. الحشوة المركبة تستخدم راتنجاً بلون الأسنان يُطبّق مباشرة في زيارة واحدة.' } },
  { id: 8, category: 'cost', q: { en: 'Do you accept insurance?', ar: 'هل تقبلون التأمين؟' }, a: { en: 'Yes. We are recognized by most major UAE health insurers including Daman, AXA, MetLife, Bupa, and Cigna. Coverage varies by policy — we recommend calling your insurer to confirm dental benefits before your appointment. Our team is happy to assist with pre-authorization paperwork.', ar: 'نعم. نحن معترف بنا من قِبل معظم شركات التأمين الصحي الرئيسية في الإمارات بما فيها ضمان وAXA وميتلايف وبوبا وسيغنا.' } },
  { id: 9, category: 'cost', q: { en: 'Do you offer payment plans?', ar: 'هل تقدمون خطط دفع بالتقسيط؟' }, a: { en: 'Yes! We offer 0% interest installment plans for treatments above AED 1,500. Plans can be spread over 3, 6, or 12 months through our partner financing providers. Ask our reception team for details — we want to make excellent dental care accessible to everyone.', ar: 'نعم! نقدم خطط تقسيط بفائدة 0٪ للعلاجات التي تزيد على 1500 درهم. يمكن توزيع الخطط على 3 أو 6 أو 12 شهراً عبر مزودي التمويل الشركاء.' } },
  { id: 10, category: 'cost', q: { en: 'How much does a check-up cost?', ar: 'كم تكلفة الفحص العام؟' }, a: { en: 'A comprehensive check-up including digital X-rays starts from AED 150. First-time patients receive a complimentary smile assessment with their check-up. We believe transparent pricing is essential — you\'ll always know costs upfront before any treatment begins.', ar: 'يبدأ الفحص الشامل بما في ذلك الأشعة الرقمية من 150 درهماً. يتلقى المرضى الجدد تقييماً مجانياً للابتسامة مع فحصهم.' } },
  { id: 11, category: 'booking', q: { en: 'How do I book an appointment?', ar: 'كيف أحجز موعداً؟' }, a: { en: 'You can book online 24/7 through our website booking system, call us at +971 4 123 4567, or WhatsApp us at +971 50 999 8888. We typically confirm appointments within 2 hours during business hours. Same-day appointments are often available for urgent cases.', ar: 'يمكنك الحجز عبر الإنترنت على مدار الساعة من خلال نظام الحجز على موقعنا، أو الاتصال بنا على +971 4 123 4567، أو مراسلتنا عبر WhatsApp.' } },
  { id: 12, category: 'booking', q: { en: 'What should I bring to my first appointment?', ar: 'ماذا يجب أن أحضر لموعدي الأول؟' }, a: { en: 'Please bring your Emirates ID, insurance card (if applicable), any previous dental X-rays or records you have, and a list of any medications you\'re currently taking. Arriving 10 minutes early to complete our digital intake form is appreciated.', ar: 'يرجى إحضار الهوية الإماراتية وبطاقة التأمين (إن وجدت) وأي أشعة أو سجلات أسنان سابقة لديك وقائمة بالأدوية التي تتناولها حالياً.' } },
]

function AccordionItem({ item, isOpen, onToggle }) {
  const { pick } = useLang()
  return (
    <div style={{
      backgroundColor: 'white', borderRadius: '0.75rem',
      overflow: 'hidden', boxShadow: '0 1px 8px rgba(17,24,39,0.05)',
      border: isOpen ? '1.5px solid #10B981' : '1.5px solid transparent',
      transition: 'border-color 0.2s',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left', padding: '1.25rem 1.5rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'none', border: 'none', cursor: 'pointer', gap: '1rem',
        }}
      >
        <span style={{ fontWeight: 600, color: '#111827', fontSize: '0.95rem', textAlign: 'left', lineHeight: 1.4 }}>
          {pick(item.q)}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            width: '1.75rem', height: '1.75rem', borderRadius: '50%',
            backgroundColor: isOpen ? '#F97316' : '#FED7AA',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, color: 'white', fontWeight: 700, fontSize: '1.1rem',
          }}
        >
          +
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 1.5rem 1.25rem', color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.7 }}>
              {pick(item.a)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQ() {
  const { pick, lang } = useLang()
  const [activeCategory, setActiveCategory] = useState('all')
  useSEO({
    title: pick({ en: 'FAQ — Dental Questions Answered | PureSmile Dubai', ar: 'الأسئلة الشائعة — إجابات عن الأسنان | PureSmile دبي' }),
    description: pick({ en: 'Common dental questions answered: costs, insurance, Invisalign duration, implant pain, booking & more. PureSmile Dental Dubai.', ar: 'إجابات عن أسئلة الأسنان الشائعة: التكاليف، التأمين، مدة انفيزيلاين، ألم الزراعة، الحجز وأكثر.' }),
    canonical: 'https://puresmile.ae/faq',
    lang,
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [openId, setOpenId] = useState(null)

  const filtered = useMemo(() => {
    let items = activeCategory === 'all' ? FAQS : FAQS.filter(f => f.category === activeCategory)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      items = items.filter(f =>
        f.q.en.toLowerCase().includes(q) || f.q.ar.includes(q) ||
        f.a.en.toLowerCase().includes(q) || f.a.ar.includes(q)
      )
    }
    return items
  }, [activeCategory, searchQuery])

  return (
    <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ backgroundColor: 'white', padding: '4rem 0 3rem' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-badge">{pick({ en: 'Got Questions?', ar: 'لديك أسئلة؟' })}</span>
            <h1 style={{ fontFamily: '"DM Sans"', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.75rem)', color: '#111827', marginBottom: '0.75rem' }}>
              {pick({ en: 'Frequently Asked Questions', ar: 'الأسئلة الشائعة' })}
            </h1>
            <p style={{ color: '#6B7280', marginBottom: '1.75rem' }}>
              {pick({ en: 'Everything you need to know before your first visit.', ar: 'كل ما تحتاج معرفته قبل زيارتك الأولى.' })}
            </p>

            {/* Search */}
            <div style={{ position: 'relative', maxWidth: '500px', margin: '0 auto' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={pick({ en: 'Search questions…', ar: 'ابحث في الأسئلة…' })}
                style={{
                  width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem',
                  borderRadius: '9999px', border: '2px solid #E5E7EB',
                  fontSize: '0.95rem', color: '#111827', outline: 'none',
                  fontFamily: 'inherit', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#10B981'}
                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter + content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`pill-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {pick(cat)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#9CA3AF' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤔</div>
            <p style={{ fontWeight: 500 }}>{pick({ en: 'No questions found. Try a different search.', ar: 'لم يتم العثور على أسئلة. جرّب بحثاً مختلفاً.' })}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <AccordionItem
                  item={item}
                  isOpen={openId === item.id}
                  onToggle={() => setOpenId(openId === item.id ? null : item.id)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="cta-mint-bg"
          style={{ borderRadius: '1rem', padding: '2rem', textAlign: 'center', marginTop: '2.5rem' }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💬</div>
          <h3 style={{ fontFamily: '"DM Sans"', fontWeight: 700, fontSize: '1.2rem', color: '#111827', marginBottom: '0.5rem' }}>
            {pick({ en: 'Still Have Questions?', ar: 'لا تزال لديك أسئلة؟' })}
          </h3>
          <p style={{ color: '#6B7280', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
            {pick({ en: 'Our team is happy to help via phone, WhatsApp, or in person.', ar: 'فريقنا سعيد بمساعدتك عبر الهاتف أو WhatsApp أو شخصياً.' })}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="tel:+97141234567" className="btn-coral" style={{ fontSize: '0.875rem', padding: '0.6rem 1.25rem' }}>
              📞 {pick({ en: 'Call Us', ar: 'اتصل بنا' })}
            </a>
            <a href="https://wa.me/971509998888" className="btn-mint-outline" style={{ fontSize: '0.875rem', padding: '0.6rem 1.25rem' }}>
              💬 WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
