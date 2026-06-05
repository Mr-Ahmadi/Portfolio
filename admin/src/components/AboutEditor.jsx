import { useState } from 'react'
import EnhanceButton from './EnhanceButton'

function TagInput({ tags, onChange, placeholder }) {
  const [input, setInput] = useState('')

  const addTag = () => {
    const val = input.trim()
    if (val && !tags.includes(val)) {
      onChange([...tags, val])
    }
    setInput('')
  }

  const removeTag = (idx) => {
    onChange(tags.filter((_, i) => i !== idx))
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addTag() }
  }

  return (
    <div className="tag-input-area" onClick={() => document.getElementById(`tag-${placeholder}`)?.focus()}>
      {tags.map((t, i) => (
        <span key={i} className="tag">
          {t}
          <span className="tag-remove" onClick={() => removeTag(i)}>&times;</span>
        </span>
      ))}
      <input
        id={`tag-${placeholder}`}
        className="tag-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder || 'Type and press Enter...'}
      />
    </div>
  )
}

function InterestEditor({ interests, onChange, showToast }) {
  const addInterest = () => {
    onChange([...interests, { icon: 'fa-star', label: '' }])
  }

  const update = (idx, field, value) => {
    const updated = interests.map((item, i) => i === idx ? { ...item, [field]: value } : item)
    onChange(updated)
  }

  const remove = (idx) => {
    onChange(interests.filter((_, i) => i !== idx))
  }

  return (
    <div>
      {interests.map((item, i) => (
        <div key={i} className="list-item">
          <div className="list-item-header">
            <span className="list-item-title">Interest #{i + 1}</span>
            <div className="list-item-actions">
              <button className="btn btn-sm btn-danger" onClick={() => remove(i)}>
                <i className="fas fa-trash" />
              </button>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Icon (FontAwesome class)</label>
              <input className="form-input" value={item.icon} onChange={e => update(i, 'icon', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Label</label>
              <div style={{ display: 'flex', gap: 4 }}>
                <input className="form-input" value={item.label} onChange={e => update(i, 'label', e.target.value)} style={{ flex: 1 }} />
                <EnhanceButton text={item.label} contextType="interest.label" onEnhanced={v => update(i, 'label', v)} showToast={showToast} />
              </div>
            </div>
          </div>
        </div>
      ))}
      <button className="btn btn-sm" onClick={addInterest}>
        <i className="fas fa-plus" /> Add Interest
      </button>
    </div>
  )
}

function InputWithEnhance({ label, value, onChange, contextType, showToast, textarea, rows }) {
  const Tag = textarea ? 'textarea' : 'input'
  return (
    <div className="form-group">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
        <label className="form-label" style={{ marginBottom: 0 }}>{label}</label>
        <EnhanceButton text={value} contextType={contextType} onEnhanced={onChange} showToast={showToast} />
      </div>
      <Tag
        className="form-input"
        {...(textarea ? { rows: rows || 3 } : {})}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

function AboutEditor({ data, updateData, showToast }) {
  const about = data.about
  const [tab, setTab] = useState('interests')

  const updateSkills = (category, val) => {
    updateData('about.skills', { ...about.skills, [category]: val })
  }

  return (
    <div className="section-editor">
      <div className="editor-tabs">
        {[
          { key: 'interests', label: 'Interests' },
          { key: 'skills', label: 'Skills' },
          { key: 'cv', label: 'CV' },
        ].map(t => (
          <button key={t.key} className={`editor-tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'interests' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Fields of Interest</div>
            </div>
          </div>
          <InterestEditor interests={about.interests} onChange={val => updateData('about.interests', val)} showToast={showToast} />
        </div>
      )}

      {tab === 'skills' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Skills & Technologies</div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Programming Languages</label>
            <TagInput tags={about.skills.languages} onChange={val => updateSkills('languages', val)} placeholder="Add language..." />
          </div>
          <div className="form-group">
            <label className="form-label">Technologies & Tools</label>
            <TagInput tags={about.skills.technologies} onChange={val => updateSkills('technologies', val)} placeholder="Add technology..." />
          </div>
        </div>
      )}

      {tab === 'cv' && (
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">CV Download</div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">CV File Path</label>
            <input className="form-input" value={about.cvFile} onChange={e => updateData('about.cvFile', e.target.value)} />
          </div>
          <InputWithEnhance label="CV Description" value={about.cvDescription} onChange={val => updateData('about.cvDescription', val)} contextType="about.cvDescription" showToast={showToast} textarea rows={2} />
        </div>
      )}
    </div>
  )
}

export default AboutEditor
