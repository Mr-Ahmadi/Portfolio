import { useState } from 'react'

const API_BASE = window.location.origin
const AI_CONFIG_KEY = 'portfolio-ai-config'

function AITextHelper({ data, showToast }) {
  const [config, setConfig] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(AI_CONFIG_KEY)) || {
        tool: 'opencode',
        apiKey: '',
        endpoint: '',
        model: '',
      }
    } catch {
      return { tool: 'opencode', apiKey: '', endpoint: '', model: '' }
    }
  })

  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConfig, setShowConfig] = useState(false)
  const [selectedSections, setSelectedSections] = useState(() => ['hero', 'about'])

  const sectionOptions = [
    { key: 'hero', label: 'Hero (name, tagline, bio)' },
    { key: 'about', label: 'About (personal info, interests, skills)' },
    { key: 'experience', label: 'Experience (research, teaching, certs, pubs)' },
    { key: 'projects', label: `Projects (${data.projects?.length || 0} entries)` },
    { key: 'contact', label: 'Contact (email, intro text)' },
  ]

  const toggleSection = (key) => {
    setSelectedSections(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const saveConfig = () => {
    localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config))
    showToast('AI config saved')
  }

  const buildSectionsContext = () => {
    if (selectedSections.length === 0) return ''
    const parts = []
    if (selectedSections.includes('hero') && data.hero) {
      parts.push(`--- Hero ---\nName: ${data.hero.name}\nTagline: ${data.hero.tagline}\nBio: ${data.hero.bio}`)
    }
    if (selectedSections.includes('about') && data.about) {
      const a = data.about
      parts.push(`--- About ---\nPersonal: ${a.personalInfo.name}, ${a.personalInfo.education}, ${a.personalInfo.university}\nInterests: ${a.interests.map(i => i.label).join(', ')}\nSkills: Languages: ${a.skills.languages.join(', ')} | Technologies: ${a.skills.technologies.join(', ')}`)
    }
    if (selectedSections.includes('experience') && data.experience) {
      const e = data.experience
      const all = [...e.research, ...e.teaching, ...e.certificates, ...e.publications]
      parts.push(`--- Experience (${all.length} entries) ---\n${all.map(item => `- ${item.title} (${item.date})`).join('\n')}`)
    }
    if (selectedSections.includes('projects') && data.projects?.length) {
      parts.push(`--- Projects (${data.projects.length}) ---\n${data.projects.map(p => `- ${p.title}: ${p.description.substring(0, 100)}`).join('\n')}`)
    }
    if (selectedSections.includes('contact') && data.contact) {
      parts.push(`--- Contact ---\nEmail: ${data.contact.email}\nGitHub: ${data.contact.github}\nLinkedIn: ${data.contact.linkedin}\nIntro: ${data.contact.intro.text}`)
    }
    return parts.join('\n\n')
  }

  const generate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt')
      return
    }
    setLoading(true)
    setError('')
    setResult('')

    const sectionsContext = buildSectionsContext()
    let fullPrompt = prompt

    if (sectionsContext) {
      fullPrompt = `I have the following portfolio content:\n\n${sectionsContext}\n\n---\n\n${prompt}`
    }

    try {
      const res = await fetch(`${API_BASE}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, tool: config.tool }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Request failed')
      setResult(data.result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyResult = () => {
    navigator.clipboard.writeText(result).then(() => {
      showToast('Copied to clipboard!')
    }).catch(() => {
      showToast('Failed to copy', 'danger')
    })
  }

  const quickActions = [
    {
      label: 'Rewrite Bio',
      action: () => setPrompt('Rewrite my bio to be more engaging and professional. Keep it concise (2-3 sentences).'),
    },
    {
      label: 'Fix Grammar & Tone',
      action: () => setPrompt('Review all my portfolio text for spelling, grammar, and tone issues. List any corrections needed.'),
    },
    {
      label: 'Suggest Emojis',
      action: () => setPrompt('Suggest appropriate emojis to add to project titles and section headings to make them more visually engaging.'),
    },
    {
      label: 'Improve Project Descriptions',
      action: () => setPrompt('Write improved descriptions for each project. Make each 1-2 sentences highlighting impact and technologies.'),
    },
    {
      label: 'Generate Taglines',
      action: () => setPrompt('Generate 5 creative tagline options for my portfolio. Just list them numbered.'),
    },
  ]

  return (
    <div className="section-editor">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">AI Helper</div>
            <div className="card-subtitle">Generate and enhance text with AI</div>
          </div>
          <button className="btn btn-sm" onClick={() => setShowConfig(!showConfig)}>
            <i className="fas fa-gear" /> {showConfig ? 'Hide Config' : 'Configure'}
          </button>
        </div>

        {showConfig && (
          <div style={{ marginBottom: 16, padding: 16, background: 'var(--bg)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div className="form-group">
              <label className="form-label">AI Tool</label>
              <select
                className="form-select"
                value={config.tool}
                onChange={e => setConfig({ ...config, tool: e.target.value })}
              >
                <option value="opencode">Opencode (zen mode)</option>
              </select>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                Uses opencode run with your configured provider.
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">API Endpoint (optional)</label>
              <input className="form-input" value={config.endpoint} onChange={e => setConfig({ ...config, endpoint: e.target.value })} placeholder="https://api.openai.com/v1/chat/completions" />
            </div>
            <div className="form-group">
              <label className="form-label">API Key (optional)</label>
              <input className="form-input" type="password" value={config.apiKey} onChange={e => setConfig({ ...config, apiKey: e.target.value })} placeholder="sk-..." />
            </div>
            <div className="form-group">
              <label className="form-label">Model (optional)</label>
              <input className="form-input" value={config.model} onChange={e => setConfig({ ...config, model: e.target.value })} placeholder="gpt-4" />
            </div>
            <div className="alert alert-info" style={{ marginBottom: 8 }}>
              <i className="fas fa-info-circle" /> Config is stored locally. API key is optional — opencode uses your existing provider config.
            </div>
            <button className="btn btn-sm btn-primary" onClick={saveConfig}>
              <i className="fas fa-floppy-disk" /> Save Config
            </button>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Portfolio Sections to Include as Context</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {sectionOptions.map(sec => (
              <button
                key={sec.key}
                className={`btn btn-sm ${selectedSections.includes(sec.key) ? 'btn-primary' : ''}`}
                onClick={() => toggleSection(sec.key)}
                style={{ fontSize: 11 }}
              >
                <i className={`fas fa-${selectedSections.includes(sec.key) ? 'check-square' : 'square'}`} style={{ marginRight: 4 }} />
                {sec.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label className="form-label">Quick Actions</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {quickActions.map((qa, i) => (
              <button key={i} className="btn btn-sm" onClick={qa.action}>{qa.label}</button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Prompt</label>
          <textarea
            className="form-textarea"
            rows={4}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="What do you want the AI to do? e.g., Write a professional bio, improve project descriptions, suggest section content..."
          />
        </div>

        <button className="btn btn-primary" onClick={generate} disabled={loading}>
          <i className={`fas fa-${loading ? 'spinner fa-spin' : 'wand-magic-sparkles'}`} />
          {loading ? 'Processing...' : 'Generate'}
        </button>

        {error && <div className="alert alert-danger" style={{ marginTop: 12 }}>{error}</div>}

        {result && (
          <div>
            <div className="ai-result">{result}</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <button className="btn btn-sm btn-primary" onClick={copyResult}>
                <i className="fas fa-copy" /> Copy
              </button>
              <button className="btn btn-sm" onClick={() => setResult('')}>Clear</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AITextHelper
