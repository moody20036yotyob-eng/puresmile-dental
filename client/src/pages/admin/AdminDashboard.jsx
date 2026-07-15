import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'

const API = (path, opts = {}) => {
  const token = localStorage.getItem('ps_admin_token')
  return fetch(path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers || {}) },
  }).then(r => r.json())
}

/* ─── Generic CRUD table ─── */
function CRUDTable({ resource, fields, title }) {
  const [items, setItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const data = await API(`/api/${resource}`)
    setItems(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [resource])

  useEffect(() => { fetchItems() }, [fetchItems])

  const blankForm = () => Object.fromEntries(fields.map(f => [f.key, '']))

  const startNew = () => {
    setForm(blankForm())
    setEditingId('new')
  }

  const startEdit = item => {
    setForm({ ...item })
    setEditingId(item.id || item._id)
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    if (editingId === 'new') {
      await API(`/api/${resource}`, { method: 'POST', body: JSON.stringify(form) })
    } else {
      await API(`/api/${resource}/${editingId}`, { method: 'PUT', body: JSON.stringify(form) })
    }
    setSaving(false)
    setEditingId(null)
    fetchItems()
  }

  const handleDelete = async id => {
    if (!window.confirm('Delete this item?')) return
    await API(`/api/${resource}/${id}`, { method: 'DELETE' })
    fetchItems()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 700, fontSize: '1.2rem', color: '#111827' }}>{title}</h2>
        {editingId === null && (
          <button className="btn-coral" style={{ fontSize: '0.85rem', padding: '0.5rem 1.1rem' }} onClick={startNew}>
            + Add New
          </button>
        )}
      </div>

      {editingId !== null && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ backgroundColor: '#F9FAFB', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.5rem', border: '1.5px solid #D1FAE5' }}
        >
          <h3 style={{ fontWeight: 600, color: '#111827', marginBottom: '1rem', fontSize: '0.95rem' }}>
            {editingId === 'new' ? 'New Entry' : 'Edit Entry'}
          </h3>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontWeight: 500, fontSize: '0.82rem', color: '#374151', marginBottom: '0.3rem' }}>
                  {f.label}
                </label>
                <textarea
                  name={f.key}
                  value={form[f.key] || ''}
                  onChange={handleChange}
                  required={f.required}
                  rows={f.rows || 1}
                  style={{
                    width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem',
                    border: '1.5px solid #E5E7EB', fontSize: '0.875rem', color: '#111827',
                    outline: 'none', fontFamily: 'inherit', resize: 'vertical',
                    transition: 'border-color 0.2s',
                    minHeight: f.rows ? `${f.rows * 1.6 + 1.2}rem` : '2.5rem',
                  }}
                  onFocus={e => e.target.style.borderColor = '#10B981'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn-mint" style={{ fontSize: '0.875rem', padding: '0.55rem 1.1rem' }} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" className="btn-mint-outline" style={{ fontSize: '0.875rem', padding: '0.55rem 1.1rem' }} onClick={() => setEditingId(null)}>
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}><span className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {items.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9CA3AF', backgroundColor: 'white', borderRadius: '0.75rem' }}>
              No entries yet. Click "+ Add New" to create one.
            </div>
          )}
          {items.map(item => (
            <div
              key={item.id || item._id}
              style={{
                backgroundColor: 'white', borderRadius: '0.75rem', padding: '1rem 1.25rem',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                boxShadow: '0 1px 8px rgba(17,24,39,0.05)', gap: '1rem',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                  {item[fields[0].key] || 'Untitled'}
                </div>
                {fields.slice(1, 3).map(f => (
                  <div key={f.key} style={{ color: '#6B7280', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '400px' }}>
                    {f.label}: {item[f.key] || '—'}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  onClick={() => startEdit(item)}
                  style={{ padding: '0.4rem 0.75rem', borderRadius: '0.5rem', backgroundColor: '#D1FAE5', color: '#065F46', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id || item._id)}
                  style={{ padding: '0.4rem 0.75rem', borderRadius: '0.5rem', backgroundColor: '#FEE2E2', color: '#DC2626', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Content Editor ─── */
function ContentEditor() {
  const [content, setContent] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    API('/api/content').then(d => setContent(d))
  }, [])

  const handleChange = (section, field, value) => {
    setContent(c => ({ ...c, [section]: { ...c[section], [field]: value } }))
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    await API('/api/content', { method: 'PUT', body: JSON.stringify(content) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (!content) return <div style={{ textAlign: 'center', padding: '2rem' }}><span className="spinner" style={{ margin: '0 auto' }} /></div>

  const sections = [
    {
      key: 'hero',
      label: 'Hero Section',
      fields: [
        { key: 'badge_en', label: 'Badge (EN)' },
        { key: 'badge_ar', label: 'Badge (AR)', rows: 1 },
        { key: 'title_en', label: 'Title (EN)', rows: 2 },
        { key: 'title_ar', label: 'Title (AR)', rows: 2 },
        { key: 'subtitle_en', label: 'Subtitle (EN)', rows: 3 },
        { key: 'subtitle_ar', label: 'Subtitle (AR)', rows: 3 },
      ],
    },
    {
      key: 'contact',
      label: 'Contact Info',
      fields: [
        { key: 'phone', label: 'Phone' },
        { key: 'email', label: 'Email' },
        { key: 'address_en', label: 'Address (EN)', rows: 2 },
        { key: 'address_ar', label: 'Address (AR)', rows: 2 },
        { key: 'hours_en', label: 'Opening Hours (EN)', rows: 3 },
        { key: 'hours_ar', label: 'Opening Hours (AR)', rows: 3 },
      ],
    },
  ]

  return (
    <form onSubmit={handleSave}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontFamily: '"DM Sans"', fontWeight: 700, fontSize: '1.2rem', color: '#111827' }}>Site Content</h2>
        <button type="submit" className="btn-coral" style={{ fontSize: '0.85rem', padding: '0.5rem 1.1rem' }} disabled={saving}>
          {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      {sections.map(section => (
        <div key={section.key} style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', marginBottom: '1.25rem', boxShadow: '0 1px 8px rgba(17,24,39,0.05)' }}>
          <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: '1rem', fontSize: '0.95rem', borderBottom: '1px solid #F3F4F6', paddingBottom: '0.5rem' }}>
            {section.label}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map(f => (
              <div key={f.key}>
                <label style={{ display: 'block', fontWeight: 500, fontSize: '0.82rem', color: '#374151', marginBottom: '0.3rem' }}>{f.label}</label>
                <textarea
                  value={(content[section.key] && content[section.key][f.key]) || ''}
                  onChange={e => handleChange(section.key, f.key, e.target.value)}
                  rows={f.rows || 1}
                  style={{
                    width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem',
                    border: '1.5px solid #E5E7EB', fontSize: '0.875rem', color: '#111827',
                    outline: 'none', fontFamily: 'inherit', resize: 'vertical',
                    minHeight: f.rows ? `${f.rows * 1.6 + 1}rem` : '2.4rem',
                  }}
                  onFocus={e => e.target.style.borderColor = '#10B981'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </form>
  )
}

/* ─── FAQ Editor ─── */
function FAQEditor() {
  return (
    <CRUDTable
      resource="faqs"
      title="FAQ Entries"
      fields={[
        { key: 'question_en', label: 'Question (EN)', required: true },
        { key: 'question_ar', label: 'Question (AR)', required: true },
        { key: 'answer_en', label: 'Answer (EN)', required: true, rows: 4 },
        { key: 'answer_ar', label: 'Answer (AR)', required: true, rows: 4 },
        { key: 'category', label: 'Category (general/treatment/cost/booking)', required: true },
      ]}
    />
  )
}

/* ─── Main Dashboard ─── */
const TABS = [
  { id: 'doctors', label: 'Doctors', icon: '👨‍⚕️' },
  { id: 'services', label: 'Services', icon: '🦷' },
  { id: 'content', label: 'Content', icon: '✏️' },
  { id: 'faq', label: 'FAQ', icon: '❓' },
]

export default function AdminDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('doctors')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #F3F4F6', padding: '0 1.5rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.3rem' }}>🦷</span>
          <span style={{ fontFamily: '"DM Sans"', fontWeight: 700, fontSize: '1rem', color: '#111827' }}>
            PureSmile <span style={{ color: '#10B981' }}>Admin</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a href="/" target="_blank" style={{ color: '#6B7280', fontSize: '0.8rem', textDecoration: 'none' }}>
            View Site →
          </a>
          <button onClick={handleLogout} style={{ padding: '0.4rem 0.9rem', borderRadius: '9999px', border: '1.5px solid #E5E7EB', color: '#6B7280', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.8rem' }}>
            Logout
          </button>
        </div>
      </header>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <aside style={{ width: '220px', backgroundColor: 'white', borderRight: '1px solid #F3F4F6', padding: '1.25rem 0.875rem', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main style={{ flex: 1, padding: '1.75rem', minWidth: 0 }}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'doctors' && (
              <CRUDTable
                resource="doctors"
                title="Doctors"
                fields={[
                  { key: 'name_en', label: 'Name (EN)', required: true },
                  { key: 'name_ar', label: 'Name (AR)', required: true },
                  { key: 'specialty_en', label: 'Specialty (EN)', required: true },
                  { key: 'specialty_ar', label: 'Specialty (AR)', required: true },
                  { key: 'bio_en', label: 'Bio (EN)', required: true, rows: 4 },
                  { key: 'bio_ar', label: 'Bio (AR)', required: true, rows: 4 },
                  { key: 'emoji', label: 'Emoji', required: false },
                ]}
              />
            )}
            {activeTab === 'services' && (
              <CRUDTable
                resource="services"
                title="Services"
                fields={[
                  { key: 'name_en', label: 'Name (EN)', required: true },
                  { key: 'name_ar', label: 'Name (AR)', required: true },
                  { key: 'category', label: 'Category', required: true },
                  { key: 'price_en', label: 'Price (EN)', required: true },
                  { key: 'price_ar', label: 'Price (AR)', required: true },
                  { key: 'duration_en', label: 'Duration (EN)', required: true },
                  { key: 'icon', label: 'Icon Emoji', required: false },
                  { key: 'desc_en', label: 'Description (EN)', required: true, rows: 3 },
                  { key: 'desc_ar', label: 'Description (AR)', required: true, rows: 3 },
                ]}
              />
            )}
            {activeTab === 'content' && <ContentEditor />}
            {activeTab === 'faq' && <FAQEditor />}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
