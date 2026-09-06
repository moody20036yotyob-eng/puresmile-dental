import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import compression from 'compression'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// On Vercel the filesystem is read-only except /tmp
const IS_VERCEL  = !!process.env.VERCEL
const DATA_DIR   = IS_VERCEL ? '/tmp/data' : join(__dirname, 'data')
const CLIENT_DIR = join(__dirname, '..', 'client', 'dist')

const JWT_SECRET     = process.env.JWT_SECRET     || 'puresmile_jwt_secret_2025_change_in_prod'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5175'
const IS_PROD        = existsSync(CLIENT_DIR)

if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

// ── helpers ───────────────────────────────────────────────
function readData(file) {
  const path = join(DATA_DIR, file)
  if (!existsSync(path)) return null
  return JSON.parse(readFileSync(path, 'utf8'))
}
function writeData(file, data) {
  writeFileSync(join(DATA_DIR, file), JSON.stringify(data, null, 2))
}
function nextId(arr) {
  return arr.length === 0 ? 1 : Math.max(...arr.map(i => i.id || 0)) + 1
}
function sanitizeString(str) {
  if (typeof str !== 'string') return ''
  return str.replace(/[<>]/g, '').trim().slice(0, 2000)
}
function sanitizeObject(obj) {
  const clean = {}
  for (const [k, v] of Object.entries(obj)) {
    clean[k] = typeof v === 'string' ? sanitizeString(v) : v
  }
  return clean
}

// ── seed data ─────────────────────────────────────────────
const SEED_DOCTORS = [
  { id: 1, name_en: 'Dr. Sarah Mitchell', name_ar: 'د. سارة ميتشل', specialty_en: 'Cosmetic Dentist & Clinical Director', specialty_ar: 'طبيبة أسنان تجميلية ومديرة سريرية', bio_en: 'Harvard-trained cosmetic dentist with 12 years crafting dream smiles in Dubai. Certified Invisalign provider.', bio_ar: 'طبيبة تجميل حاصلة على تدريب من هارفارد مع 12 عاماً من الخبرة في دبي.', emoji: '👩‍⚕️' },
  { id: 2, name_en: 'Dr. Ahmed Al-Rashid', name_ar: 'د. أحمد الراشد', specialty_en: 'Orthodontist', specialty_ar: 'طبيب تقويم أسنان', bio_en: 'Board-certified orthodontist trained at Melbourne. Diamond Invisalign provider with 3,000+ cases.', bio_ar: 'أخصائي تقويم معتمد تدرّب في ملبورن. مزود Invisalign الماسي مع أكثر من 3000 حالة.', emoji: '👨‍⚕️' },
  { id: 3, name_en: 'Dr. Priya Sharma', name_ar: 'د. بريا شارما', specialty_en: 'Implant Surgeon & Periodontist', specialty_ar: 'جراحة زراعة وأمراض اللثة', bio_en: 'Masters in Oral Implantology (Frankfurt). Specialist in All-on-4 and minimally invasive implant surgery.', bio_ar: 'ماجستير في زراعة الأسنان الفموية (فرانكفورت). متخصصة في All-on-4.', emoji: '👩‍⚕️' },
  { id: 4, name_en: 'Dr. Khalid Hassan', name_ar: 'د. خالد حسان', specialty_en: 'Endodontist (Root Canal Specialist)', specialty_ar: 'طبيب علاج جذور الأسنان', bio_en: 'Renowned for painless root canal treatments using microscope-aided endodontics. Trained in Germany.', bio_ar: 'مشهور بعلاجات جذور الأسنان غير المؤلمة. تدرّب في ألمانيا.', emoji: '👨‍⚕️' },
  { id: 5, name_en: 'Dr. Nour Al-Amin', name_ar: 'د. نور الأمين', specialty_en: 'Pediatric Dentist', specialty_ar: 'طبيبة أسنان أطفال', bio_en: 'Specialist in child dental care with a gentle, fun approach. Board certified in pediatric dentistry.', bio_ar: 'متخصصة في رعاية أسنان الأطفال بنهج لطيف وممتع.', emoji: '👩‍⚕️' },
]
const SEED_SERVICES = [
  { id: 1, category: 'general', icon: '🦷', name_en: 'General Check-up', name_ar: 'فحص عام', price_en: 'From AED 150', price_ar: 'من 150 درهم', duration_en: '45 min', duration_ar: '45 دقيقة', desc_en: 'Complete oral examination including digital X-rays, periodontal charting, and personalised treatment planning.', desc_ar: 'فحص شامل للفم يشمل الأشعة الرقمية ورسم اللثة وخطة العلاج الشخصية.' },
  { id: 2, category: 'general', icon: '🧹', name_en: 'Teeth Cleaning', name_ar: 'تنظيف الأسنان', price_en: 'From AED 250', price_ar: 'من 250 درهم', duration_en: '60 min', duration_ar: '60 دقيقة', desc_en: 'Professional scaling and polishing to remove tartar, plaque and surface stains.', desc_ar: 'تنظيف احترافي وتلميع لإزالة الجير والبلاك.' },
  { id: 3, category: 'cosmetic', icon: '🌟', name_en: 'Teeth Whitening', name_ar: 'تبييض الأسنان', price_en: 'From AED 800', price_ar: 'من 800 درهم', duration_en: '90 min', duration_ar: '90 دقيقة', desc_en: 'Zoom! in-chair whitening for instant results or custom take-home trays.', desc_ar: 'تبييض Zoom! داخل العيادة لنتائج فورية.' },
  { id: 4, category: 'cosmetic', icon: '✨', name_en: 'Porcelain Veneers', name_ar: 'قشور البورسلين', price_en: 'From AED 1,500/tooth', price_ar: 'من 1500 درهم/سن', duration_en: '2 visits', duration_ar: 'زيارتان', desc_en: 'Ultra-thin porcelain shells to correct shape, color, and alignment.', desc_ar: 'قشائح بورسلين رفيعة لتصحيح الشكل واللون والمحاذاة.' },
  { id: 5, category: 'ortho', icon: '📐', name_en: 'Invisalign', name_ar: 'انفيزيلاين', price_en: 'From AED 8,000', price_ar: 'من 8000 درهم', duration_en: '12–18 months', duration_ar: '12–18 شهراً', desc_en: 'Clear aligner system for discreet tooth straightening.', desc_ar: 'نظام محاذاة شفاف لتقويم الأسنان بشكل غير محسوس.' },
  { id: 6, category: 'surgical', icon: '🔬', name_en: 'Dental Implants', name_ar: 'زراعة الأسنان', price_en: 'From AED 4,500', price_ar: 'من 4500 درهم', duration_en: '3–6 months total', duration_ar: '3–6 أشهر إجمالاً', desc_en: 'Titanium implants surgically placed to replace missing teeth.', desc_ar: 'غرسات تيتانيوم توضع جراحياً لاستبدال الأسنان المفقودة.' },
  { id: 7, category: 'pediatric', icon: '👶', name_en: 'Pediatric Check-up', name_ar: 'فحص الأطفال', price_en: 'From AED 120', price_ar: 'من 120 درهم', duration_en: '30 min', duration_ar: '30 دقيقة', desc_en: 'Fun, gentle dental exams for children with prizes and a positive experience.', desc_ar: 'فحوصات أسنان ممتعة ولطيفة للأطفال بأدوات تفاعلية وجوائز.' },
]
const SEED_CONTENT = {
  hero: { badge_en: '🏆 #1 Rated Clinic in Dubai', badge_ar: '🏆 العيادة الأولى في دبي', title_en: 'Your Perfect Smile Starts Here', title_ar: 'ابتسامتك المثالية تبدأ هنا', subtitle_en: 'World-class dental care in the heart of Dubai.', subtitle_ar: 'رعاية أسنان عالمية المستوى في قلب دبي.' },
  contact: { phone: '+971 4 123 4567', email: 'hello@puresmile.ae', address_en: 'Level 4, Aspect Tower, Business Bay, Dubai, UAE', address_ar: 'الطابق 4، برج أسبكت، الخليج التجاري، دبي', hours_en: 'Sun–Thu: 9am–8pm\nFri: 10am–6pm\nSat: 10am–4pm', hours_ar: 'الأحد–الخميس: ٩ص–٨م\nالجمعة: ١٠ص–٦م\nالسبت: ١٠ص–٤م' },
}
const SEED_FAQS = [
  { id: 1, category: 'general', question_en: 'How often should I visit the dentist?', question_ar: 'كم مرة يجب أن أزور طبيب الأسنان؟', answer_en: 'We recommend a check-up every 6 months for most patients.', answer_ar: 'نوصي بفحص كل 6 أشهر لمعظم المرضى.' },
  { id: 2, category: 'cost', question_en: 'Do you accept insurance?', question_ar: 'هل تقبلون التأمين؟', answer_en: 'Yes — Daman, AXA, MetLife, Bupa, Cigna and most UAE insurers.', answer_ar: 'نعم — ضمان وAXA وميتلايف وبوبا وسيغنا ومعظم شركات التأمين الإماراتية.' },
  { id: 3, category: 'booking', question_en: 'How do I book an appointment?', question_ar: 'كيف أحجز موعداً؟', answer_en: 'Book online 24/7, call +971 4 123 4567, or WhatsApp +971 50 999 8888.', answer_ar: 'احجز عبر الإنترنت أو اتصل على +971 4 123 4567.' },
]

function initData() {
  if (!readData('doctors.json'))  writeData('doctors.json',  SEED_DOCTORS)
  if (!readData('services.json')) writeData('services.json', SEED_SERVICES)
  if (!readData('content.json'))  writeData('content.json',  SEED_CONTENT)
  if (!readData('faqs.json'))     writeData('faqs.json',     SEED_FAQS)
}
initData()

// ── App setup ─────────────────────────────────────────────
const app = express()

app.use(compression({ level: 6, threshold: 1024 }))

app.use(helmet({
  contentSecurityPolicy: IS_PROD ? {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc:     ["'self'", 'https://fonts.gstatic.com'],
      imgSrc:      ["'self'", 'data:', 'https:'],
      connectSrc:  ["'self'"],
      objectSrc:   ["'none'"],
    },
  } : false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  noSniff: true,
  frameguard: { action: 'deny' },
}))

app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}))

app.use('/api', rateLimit({ windowMs: 15*60*1000, max: 300, standardHeaders: true, legacyHeaders: false }))
app.use('/api/auth', rateLimit({ windowMs: 15*60*1000, max: 10, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many login attempts.' } }))

app.use(express.json({ limit: '50kb' }))

// Serve production build if available (local only — Vercel handles static separately)
if (IS_PROD && !IS_VERCEL) {
  app.use('/assets', express.static(join(CLIENT_DIR, 'assets'), { maxAge: '1y', immutable: true }))
  app.use(express.static(CLIENT_DIR, { maxAge: '1h' }))
}

// ── Auth ──────────────────────────────────────────────────
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized.' })
  try {
    req.user = jwt.verify(auth.slice(7), JWT_SECRET, { algorithms: ['HS256'] })
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() })
  next()
}

app.post('/api/auth/login',
  [body('password').isString().notEmpty()],
  handleValidation,
  (req, res) => {
    if (req.body.password !== ADMIN_PASSWORD) {
      return setTimeout(() => res.status(401).json({ error: 'Incorrect password.' }), 400)
    }
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '7d' })
    res.json({ token })
  }
)

const writeLimiter = rateLimit({ windowMs: 60*1000, max: 30 })

function crudRoutes(file, base) {
  app.get(base, (_req, res) => res.json(readData(file) || []))

  app.post(base, authMiddleware, writeLimiter, (req, res) => {
    const items = readData(file) || []
    const item  = { id: nextId(items), ...sanitizeObject(req.body) }
    items.push(item)
    writeData(file, items)
    res.status(201).json(item)
  })

  app.put(`${base}/:id`, authMiddleware, writeLimiter, (req, res) => {
    const items = readData(file) || []
    const idx   = items.findIndex(i => String(i.id) === req.params.id)
    if (idx === -1) return res.status(404).json({ error: 'Not found.' })
    items[idx] = { ...items[idx], ...sanitizeObject(req.body), id: items[idx].id }
    writeData(file, items)
    res.json(items[idx])
  })

  app.delete(`${base}/:id`, authMiddleware, writeLimiter, (req, res) => {
    let items = readData(file) || []
    if (!items.some(i => String(i.id) === req.params.id)) return res.status(404).json({ error: 'Not found.' })
    writeData(file, items.filter(i => String(i.id) !== req.params.id))
    res.json({ ok: true })
  })
}

crudRoutes('doctors.json',  '/api/doctors')
crudRoutes('services.json', '/api/services')
crudRoutes('faqs.json',     '/api/faqs')

app.get('/api/content', (_req, res) => res.json(readData('content.json') || {}))
app.put('/api/content', authMiddleware, writeLimiter, (req, res) => {
  writeData('content.json', sanitizeObject(req.body))
  res.json({ ok: true })
})

// SPA fallback (local prod only)
if (IS_PROD && !IS_VERCEL) {
  app.get('*', (_req, res) => res.sendFile(join(CLIENT_DIR, 'index.html')))
}

app.use((req, res) => res.status(404).json({ error: 'Not found.' }))
app.use((err, _req, res, _next) => {
  console.error(err.message)
  res.status(500).json({ error: 'Internal server error.' })
})

export default app
