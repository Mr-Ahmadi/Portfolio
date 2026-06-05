import { useState } from 'react'
import EnhanceButton from './EnhanceButton'

function ExperienceList({ items, onChange, category, fields, showToast }) {
  const [pendingDelete, setPendingDelete] = useState(null)

  const add = () => {
    const empty = {}
    fields.forEach(f => { empty[f.key] = '' })
    onChange([...items, empty])
  }

  const update = (idx, field, value) => {
    const updated = items.map((item, i) => i === idx ? { ...item, [field]: value } : item)
    onChange(updated)
  }

  const remove = (idx) => {
    if (pendingDelete === idx) {
      onChange(items.filter((_, i) => i !== idx))
      setPendingDelete(null)
    } else {
      setPendingDelete(idx)
    }
  }

  const move = (idx, dir) => {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= items.length) return
    const arr = [...items]
    const [removed] = arr.splice(idx, 1)
    arr.splice(newIdx, 0, removed)
    onChange(arr)
  }

  const enhanceFields = ['title', 'detail', 'institution']

  return (
    <div>
      {items.length === 0 && <div className="empty-state">No {category} entries yet.</div>}
      {items.map((item, i) => (
        <div key={i} className="list-item" style={{
          ...(pendingDelete === i ? { background: 'rgba(220,53,69,0.1)', border: '1px solid var(--danger)' } : {}),
        }}>
          <div className="list-item-header">
            <span className="list-item-title">
              {item.title || `${category} #${i + 1}`}
              {pendingDelete === i && (
                <span style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 600, marginLeft: 8 }}>Click trash again to delete</span>
              )}
            </span>
            <div className="list-item-actions">
              <button className="btn btn-sm" onClick={() => move(i, -1)} disabled={i === 0}>
                <i className="fas fa-chevron-up" />
              </button>
              <button className="btn btn-sm" onClick={() => move(i, 1)} disabled={i === items.length - 1}>
                <i className="fas fa-chevron-down" />
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => remove(i)}>
                <i className={`fas fa-${pendingDelete === i ? 'times' : 'trash'}`} />
              </button>
            </div>
          </div>
          <div className="list-item-content">
            {fields.map(f => (
              <div className="form-group" key={f.key} style={{ marginBottom: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: f.type === 'textarea' ? 5 : 0 }}>
                  <label className="form-label" style={{ marginBottom: 0 }}>{f.label}</label>
                  {enhanceFields.includes(f.key) && (
                    <EnhanceButton
                      text={item[f.key] || ''}
                      contextType={`${category.toLowerCase()}.${f.key}`}
                      onEnhanced={v => update(i, f.key, v)}
                      showToast={showToast}
                    />
                  )}
                </div>
                {f.type === 'textarea' ? (
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={item[f.key] || ''}
                    onChange={e => update(i, f.key, e.target.value)}
                  />
                ) : (
                  <input
                    className="form-input"
                    value={item[f.key] || ''}
                    onChange={e => update(i, f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button className="btn btn-sm" onClick={add}>
        <i className="fas fa-plus" /> Add {category}
      </button>
    </div>
  )
}

const researchFields = [
  { key: 'title', label: 'Title' },
  { key: 'date', label: 'Date' },
  { key: 'institution', label: 'Institution' },
  { key: 'detail', label: 'Detail', type: 'textarea' },
]

const teachingFields = [
  { key: 'title', label: 'Title' },
  { key: 'date', label: 'Date' },
  { key: 'institution', label: 'Institution' },
  { key: 'detail', label: 'Detail', type: 'textarea' },
]

const certFields = [
  { key: 'title', label: 'Title' },
  { key: 'date', label: 'Date' },
  { key: 'institution', label: 'Institution' },
  { key: 'detail', label: 'Detail' },
  { key: 'link', label: 'Certificate Link (URL)' },
  { key: 'linkLabel', label: 'Link Display Text' },
]

const pubFields = [
  { key: 'title', label: 'Title' },
  { key: 'date', label: 'Date' },
  { key: 'institution', label: 'Authors / Institution' },
  { key: 'detail', label: 'Detail', type: 'textarea' },
  { key: 'link', label: 'Publication Link (URL)' },
  { key: 'linkLabel', label: 'Link Display Text' },
]

function ExperienceEditor({ data, updateData, showToast }) {
  const exp = data.experience
  const [tab, setTab] = useState('research')

  return (
    <div className="section-editor">
      <div className="editor-tabs">
        {[
          { key: 'research', label: `Research (${exp.research.length})` },
          { key: 'teaching', label: `Teaching (${exp.teaching.length})` },
          { key: 'certificates', label: `Certificates (${exp.certificates.length})` },
          { key: 'publications', label: `Publications (${exp.publications.length})` },
        ].map(t => (
          <button
            key={t.key}
            className={`editor-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'research' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Research Positions</div>
          </div>
          <ExperienceList
            items={exp.research}
            onChange={val => updateData('experience.research', val)}
            category="Research"
            fields={researchFields}
            showToast={showToast}
          />
        </div>
      )}

      {tab === 'teaching' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Teaching Positions</div>
          </div>
          <ExperienceList
            items={exp.teaching}
            onChange={val => updateData('experience.teaching', val)}
            category="Teaching"
            fields={teachingFields}
            showToast={showToast}
          />
        </div>
      )}

      {tab === 'certificates' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Certificates</div>
          </div>
          <ExperienceList
            items={exp.certificates}
            onChange={val => updateData('experience.certificates', val)}
            category="Certificate"
            fields={certFields}
            showToast={showToast}
          />
        </div>
      )}

      {tab === 'publications' && (
        <div className="card">
          <div className="card-header">
            <div className="card-title">Publications</div>
          </div>
          <ExperienceList
            items={exp.publications}
            onChange={val => updateData('experience.publications', val)}
            category="Publication"
            fields={pubFields}
            showToast={showToast}
          />
        </div>
      )}
    </div>
  )
}

export default ExperienceEditor
