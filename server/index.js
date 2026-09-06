import app from './app.js'

const PORT = process.env.PORT || 4002

app.listen(PORT, () => {
  console.log(`✅  PureSmile  →  http://localhost:${PORT}`)
  console.log(`📦  Mode: PRODUCTION (serving built client)`)
  console.log(`🔒  Helmet + gzip + rate-limit active`)
})
