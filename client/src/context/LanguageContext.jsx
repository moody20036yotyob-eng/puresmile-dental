import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('ps_lang') || 'en')

  useEffect(() => {
    document.documentElement.lang = lang
    document.body.dir = lang === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem('ps_lang', lang)
  }, [lang])

  const toggle = () => setLang(l => l === 'en' ? 'ar' : 'en')

  const pick = (obj) => obj[lang] || obj.en

  return (
    <LanguageContext.Provider value={{ lang, toggle, pick, isRTL: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  return useContext(LanguageContext)
}
