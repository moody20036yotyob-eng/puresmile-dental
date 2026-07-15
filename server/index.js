import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { body, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = join(__dirname, 'data')

// ── env / config ──────────────────────────────────────────
const PORT           = process.env.PORT           || 4002
const JWT_SECRET     = process.env.JWT_SECRET     || 'puresmile_jwt_secret_2025_change_in_prod'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5175'

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
  { id: 1, name_en: 'Dr. Sarah Mitchell', name_ar: 'د. سارة ميتشل', specialty_en: 'Cosmetic Dentist & Clinical Director', specialty_ar: 'طبيبة أسنان تجميلية ومديرة سريرية', bio_en: 'Harvard-trained cosmetic dentist with 12 years crafting dream smiles in Dubai. Certified Invisalign provider.', bio_ar: 'طبيبة تجميل حاصلة على تدريب من هارفارد مع 12 عاماً من الخبرة في دبي. مزودة Invisalign معتمدة.', emoji: '👩‍⚕️' },
  { id: 2, name_en: 'Dr. Ahmed Al-Rashid', name_ar: 'د. أحمد الراشد', specialty_en: 'Orthodontist', specialty_ar: 'طبيب تقويم أسنان', bio_en: 'Board-certified orthodontist trained at Melbourne. Diamond Invisalign provider with 3,000+ cases.', bio_ar: 'أخصائي تقويم معتمد تدرّب في ملبورن. مزود Invisalign الماسي مع أكثر من 3000 حالة.', emoji: '👨‍⚕️' },
  { id: 3, name_en: 'Dr. Priya Sharma', name_ar: 'د. بريا شارما', specialty_en: 'Implant Surgeon & Periodontist', specialty_ar: 'جراحة زراعة وأمراض اللثة', bio_en: 'Masters in Oral Implantology (Frankfurt). Specialist in All-on-4 and minimally invasive implant surgery.', bio_ar: 'ماجستير في زراعة الأسنان الفموية (فرانكفورت). متخصصة في All-on-4 وجراحة الزراعة طفيفة التوغل.', emoji: '👩‍⚕️' },
  { id: 4, name_en: 'Dr. Khalid Hassan', name_ar: 'د. خالد حسان', specialty_en: 'Endodontist (Root Canal Specialist)', specialty_ar: 'طبيب علاج جذور الأسنان', bio_en: 'Renowned for painless root canal treatments using microscope-aided endodontics. Trained in Germany.', bio_ar: 'مشهور بعلاجات جذور الأسنان غير المؤلمة باستخدام طب الجذور بالمجهر. تدرّب في ألمانيا.', emoji: '👨‍⚕️' },
  { id: 5, name_en: 'Dr. Nour Al-Amin', name_ar: 'د. نور الأمين', specialty_en: 'Pediatric Dentist', specialty_ar: 'طبيبة أسنان أطفال', bio_en: 'Specialist in child dental care with a gentle, fun approach. Board certified in pediatric dentistry.', bio_ar: 'متخصصة في رعاية أسنان الأطفال بنهج لطيف وممتع. معتمدة في طب أسنان الأطفال.', emoji: '👩‍⚕️' },
]

const SEED_SERVICES = [
  { id: 1, category: 'general', icon: '🦷', name_en: 'General Check-up', name_ar: 'فحص عام', price_en: 'From AED 150', price_ar: 'من 150 درهم', duration_en: '45 min', duration_ar: '45 دقيقة', desc_en: 'Complete oral examination including digital X-rays, periodontal charting, and personalised treatment planning.', desc_ar: 'فحص شامل للفم يشمل الأشعة الرقمية ورسم اللثة وخطة العلاج الشخصية.' },
  { id: 2, category: 'general', icon: '🧹', name_en: 'Teeth Cleaning', name_ar: 'تنظيف الأسنان', price_en: 'From AED 250', price_ar: 'من 250 درهم', duration_en: '60 min', duration_ar: '60 دقيقة', desc_en: 'Professional scaling and polishing to remove tartar, plaque and surface stains.', desc_ar: 'تنظيف احترافي وتلميع لإزالة الجير والبلاك والبقع السطحية.' },
  { id: 3, category: 'cosmetic', icon: '🌟', name_en: 'Teeth Whitening', name_ar: 'تبييض الأسنان', price_en: 'From AED 800', price_ar: 'من 800 درهم', duration_en: '90 min', duration_ar: '90 دقيقة', desc_en: 'Zoom! in-chair whitening for instant results or custom take-home trays for lasting brightness.', desc_ar: 'تبييض Zoom! داخل العيادة لنتائج فورية أو صواني منزلية مخصصة لإشراق دائم.' },
  { id: 4, category: 'cosmetic', icon: '✨', name_en: 'Porcelain Veneers', name_ar: 'قشور البورسلين', price_en: 'From AED 1,500/tooth', price_ar: 'من 1500 درهم/سن', duration_en: '2 visits', duration_ar: 'زيارتان', desc_en: 'Ultra-thin porcelain shells to correct shape, color, and alignment of your teeth.', desc_ar: 'قشائح بورسلين رفيعة لتصحيح شكل ولون ومحاذاة أسنانك.' },
  { id: 5, category: 'ortho', icon: '📐', name_en: 'Invisalign', name_ar: 'انفيزيلاين', price_en: 'From AED 8,000', price_ar: 'من 8000 درهم', duration_en: '12–18 months', duration_ar: '12–18 شهراً', desc_en: 'Clear aligner system for discreet tooth straightening. Removable and virtually invisible.', desc_ar: 'نظام محاذاة شفاف لتقويم الأسنان بشكل غير محسوس. قابل للإزالة وغير مرئي تقريباً.' },
  { id: 6, category: 'surgical', icon: '🔬', name_en: 'Dental Implants', name_ar: 'زراعة الأسنان', price_en: 'From AED 4,500', price_ar: 'من 4500 درهم', duration_en: '3–6 months total', duration_ar: '3–6 أشهر إجمالاً', desc_en: 'Titanium implants surgically placed to replace missing teeth with permanent natural-looking crowns.', desc_ar: 'غرسات تيتانيوم توضع جراحياً لاستبدال الأسنان المفقودة بتيجان دائمة وطبيعية المظهر.' },
  { id: 7, category: 'pediatric', icon: '👶', name_en: 'Pediatric Check-up', name_ar: 'فحص الأطفال', price_en: 'From AED 120', price_ar: 'من 120 درهم', duration_en: '30 min', duration_ar: '30 دقيقة', desc_en: 'Fun, gentle dental exams for children with interactive tools, prizes, and a positive first experience.', desc_ar: 'فحوصات أسنان ممتعة ولطيفة للأطفال بأدوات تفاعلية وجوائز وتجربة أولى إيجابية.' },
]

const SEED_CONTENT = {
  hero: {
    badge_en: '🏆 #1 Rated Clinic in Dubai',
    badge_ar: '🏆 العيادة الأولى في دبي',
    title_en: 'Your Perfect Smile Starts Here',
    title_ar: 'ابتسامتك المثالية تبدأ هنا',
    subtitle_en: 'Experience world-class dental care at PureSmile Dental — where cutting-edge technology meets compassionate care in the heart of Dubai.',
    subtitle_ar: 'اختبر رعاية أسنان عالمية المستوى في PureSmile Dental — حيث تلتقي التكنولوجيا المتطورة بالرعاية الرحيمة في قلب دبي.',
  },
  contact: {
    phone: '+971 4 123 4567',
    email: 'hello@puresmile.ae',
    address_en: 'Level 4, Aspect Tower, Business Bay, Dubai, UAE',
    address_ar: 'الطابق 4، برج أسبكت، الخليج التجاري، دبي، الإمارات',
    hours_en: 'Sun–Thu: 9am–8pm\nFri: 10am–6pm\nSat: 10am–4pm',
    hours_ar: 'الأحد–الخميس: ٩ص–٨م\nالجمعة: ١٠ص–٦م\nالسبت: ١٠ص–٤م',
  },
}

const SEED_FAQS = [
  { id: 1, category: 'general', question_en: 'How often should I visit the dentist?', question_ar: 'كم مرة يجب أن أزور طبيب الأسنان؟', answer_en: 'We recommend a check-up and professional cleaning every 6 months for most patients.', answer_ar: 'نوصي بفحص وتنظيف احترافي كل 6 أشهر لمعظم المرضى.' },
  { id: 2, category: 'cost', question_en: 'Do you accept insurance?', question_ar: 'هل تقبلون التأمين؟', answer_en: 'Yes. We are recognized by most major UAE health insurers including Daman, AXA, MetLife, Bupa, and Cigna.', answer_ar: 'نعم. نحن معترف بنا من قِبل معظم شركات التأمين الصحي الرئيسية في الإمارات.' },
  { id: 3, category: 'booking', question_en: 'How do I book an appointment?', question_ar: 'كيف أحجز موعداً؟', answer_en: 'You can book online 24/7 through our website, call us at +971 4 123 4567, or WhatsApp us at +971 50 999 8888.', answer_ar: 'يمكنك الحجز عبر الإنترنت على مدار الساعة، أو الاتصال بنا على +971 4 123 4567.' },
]

function initData() {
  if (!readData('doctors.json'))  writeData('doctors.json',  SEED_DOCTORS)
  if (!readData('services.json')) writeData('services.json', SEED_SERVICES)
  if (!readData('content.json'))  writeData('content.json',  SEED_CONTENT)
  if (!readData('faqs.json'))     writeData('faqs.json',     SEED_FAQS)
}
initData()

// ── Express app ───────────────────────────────────────────
const app = express()

// ── Security: Helmet (HTTP headers) ──────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", ALLOWED_ORIGIN],
      fontSrc:    ["'self'", 'https://fonts.gstatic.com'],
      objectSrc:  ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
}))

// ── Security: CORS ────────────────────────────────────────
app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}))

// ── Security: Rate limiting ───────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 10,                    // strict: 10 login attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts, please try again in 15 minutes.' },
})

const writeLimiter = rateLimit({
  windowMs: 60 * 1000,        // 1 min
  max: 30,
  message: { error: 'Too many write requests.' },
})

app.use(globalLimiter)
app.use(express.json({ limit: '50kb' }))   // block huge payloads

// ── Auth middleware ───────────────────────────────────────
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed authorization header.' })
  }
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET, {
      algorithms: ['HS256'],
      maxAge: '7d',
    })
    req.user = payload
    next()
  } catch (err) {
    const msg = err.name === 'TokenExpiredError' ? 'Token expired.' : 'Invalid token.'
    res.status(401).json({ error: msg })
  }
}

// ── Validation error handler ──────────────────────────────
function handleValidation(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array().map(e => ({ field: e.path, msg: e.msg })) })
  }
  next()
}

// ── Auth route ────────────────────────────────────────────
app.post('/api/auth/login',
  authLimiter,
  [body('password').isString().notEmpty().withMessage('Password is required.')],
  handleValidation,
  (req, res) => {
    const { password } = req.body
    if (password !== ADMIN_PASSWORD) {
      // Constant-time-ish delay to slow brute force
      setTimeout(() => res.status(401).json({ error: 'Incorrect password.' }), 400)
      return
    }
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, {
      algorithm: 'HS256',
      expiresIn: '7d',
      issuer: 'puresmile-api',
      audience: 'puresmile-admin',
    })
    res.json({ token })
  }
)

// ── Generic CRUD factory ──────────────────────────────────
const textField  = (name) => body(name).optional().isString().isLength({ max: 1000 }).trim()
const reqText    = (name) => body(name).isString().notEmpty().isLength({ max: 1000 }).trim()

const validators = {
  doctors:  [reqText('name_en'), reqText('name_ar'), reqText('specialty_en'), reqText('specialty_ar'), textField('bio_en'), textField('bio_ar'), textField('emoji')],
  services: [reqText('name_en'), reqText('name_ar'), reqText('category'), textField('price_en'), textField('price_ar'), textField('duration_en'), textField('icon'), textField('desc_en'), textField('desc_ar')],
  faqs:     [reqText('question_en'), reqText('question_ar'), reqText('answer_en'), reqText('answer_ar'), reqText('category')],
}

function crudRoutes(file, basePath) {
  const v = validators[basePath.replace('/api/', '')] || []

  app.get(basePath, (req, res) => {
    res.json(readData(file) || [])
  })

  app.post(basePath, authMiddleware, writeLimiter, v, handleValidation, (req, res) => {
    const items = readData(file) || []
    const newItem = { id: nextId(items), ...sanitizeObject(req.body) }
    items.push(newItem)
    writeData(file, items)
    res.status(201).json(newItem)
  })

  app.put(`${basePath}/:id`, authMiddleware, writeLimiter, v, handleValidation, (req, res) => {
    const items = readData(file) || []
    const idx = items.findIndex(i => String(i.id) === String(req.params.id))
    if (idx === -1) return res.status(404).json({ error: 'Not found.' })
    items[idx] = { ...items[idx], ...sanitizeObject(req.body), id: items[idx].id }
    writeData(file, items)
    res.json(items[idx])
  })

  app.delete(`${basePath}/:id`, authMiddleware, writeLimiter, (req, res) => {
    let items = readData(file) || []
    const existed = items.some(i => String(i.id) === String(req.params.id))
    if (!existed) return res.status(404).json({ error: 'Not found.' })
    items = items.filter(i => String(i.id) !== String(req.params.id))
    writeData(file, items)
    res.json({ ok: true })
  })
}

crudRoutes('doctors.json',  '/api/doctors')
crudRoutes('services.json', '/api/services')
crudRoutes('faqs.json',     '/api/faqs')

// ── Content ───────────────────────────────────────────────
app.get('/api/content', (req, res) => {
  res.json(readData('content.json') || {})
})

app.put('/api/content', authMiddleware, writeLimiter,
  [body().isObject().withMessage('Body must be an object.')],
  handleValidation,
  (req, res) => {
    writeData('content.json', sanitizeObject(req.body))
    res.json({ ok: true })
  }
)

// ── 404 catch-all ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' })
})

// ── Global error handler ──────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message)
  res.status(500).json({ error: 'Internal server error.' })
})

app.listen(PORT, () => {
  console.log(`✅  PureSmile API  →  http://localhost:${PORT}`)
  console.log(`🔒  Security: Helmet + Rate-limit + Input validation active`)
})
