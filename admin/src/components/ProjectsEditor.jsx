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
    <div className="tag-input-area" onClick={() => document.getElementById('project-tag-input')?.focus()}>
      {tags.map((t, i) => (
        <span key={i} className="tag">
          {t}
          <span className="tag-remove" onClick={() => removeTag(i)}>&times;</span>
        </span>
      ))}
      <input
        id="project-tag-input"
        className="tag-input"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder={placeholder || 'Add tag...'}
      />
    </div>
  )
}

function ProjectsEditor({ data, updateData, showToast }) {
  const projects = data.projects
  const [editingIdx, setEditingIdx] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

    const toggleVisible = (idx) => {
        const updated = projects.map((p, i) => i === idx ? { ...p, visible: p.visible === false ? true : false } : p)
        updateData('projects', updated)
    }

    const addProject = () => {
        const baseTitle = 'New Project'
        const exists = projects.some(p => p.title.toLowerCase() === baseTitle.toLowerCase())
        if (exists) {
            showToast('A project titled "New Project" already exists', 'warning')
            return
        }
        const newProject = {
            icon: '📁',
            title: baseTitle,
            date: new Date().getFullYear().toString(),
            description: '',
            tags: [],
            github: '',
            visible: true,
        }
        updateData('projects', [...projects, newProject])
        setEditingIdx(projects.length)
    }

  const updateProject = (idx, field, value) => {
    const updated = projects.map((p, i) => i === idx ? { ...p, [field]: value } : p)
    updateData('projects', updated)
  }

  const removeProject = (idx) => {
    if (pendingDelete === idx) {
      updateData('projects', projects.filter((_, i) => i !== idx))
      setPendingDelete(null)
      if (editingIdx === idx) setEditingIdx(null)
      else if (editingIdx > idx) setEditingIdx(editingIdx - 1)
    } else {
      setPendingDelete(idx)
    }
  }

  const moveProject = (idx, dir) => {
    const newIdx = idx + dir
    if (newIdx < 0 || newIdx >= projects.length) return
    const arr = [...projects]
    const [removed] = arr.splice(idx, 1)
    arr.splice(newIdx, 0, removed)
    updateData('projects', arr)
    setEditingIdx(newIdx)
  }

  const duplicateProject = (idx) => {
    const clone = { ...projects[idx], title: projects[idx].title + ' (copy)' }
    const updated = [...projects]
    updated.splice(idx + 1, 0, clone)
    updateData('projects', updated)
    setEditingIdx(idx + 1)
  }

  return (
    <div className="section-editor">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Projects ({projects.length})</div>
            <div className="card-subtitle">Manage your portfolio projects</div>
          </div>
          <button className="btn btn-sm btn-primary" onClick={addProject}>
            <i className="fas fa-plus" /> New Project
          </button>
        </div>

        {projects.length === 0 && (
          <div className="empty-state">No projects yet. Click "New Project" to add one.</div>
        )}

        {projects.map((project, i) => (
          <div key={i} className="list-item" style={{
            border: editingIdx === i ? '1px solid var(--primary)' : undefined,
            ...(pendingDelete === i ? { background: 'rgba(220,53,69,0.1)', border: '1px solid var(--danger)' } : {}),
            ...(project.visible === false ? { opacity: 0.5 } : {}),
          }}>
            <div className="list-item-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>{project.icon}</span>
                <span className="list-item-title">{project.title || `Project #${i + 1}`}</span>
                {project.visible === false && (
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: 'rgba(136,136,160,0.2)', color: 'var(--text-muted)' }}>hidden</span>
                )}
                {pendingDelete === i && (
                  <span style={{ fontSize: 11, color: 'var(--danger)', fontWeight: 600 }}>Click trash again to delete</span>
                )}
              </div>
              <div className="list-item-actions">
                <button className="btn btn-sm" onClick={() => toggleVisible(i)} title={project.visible === false ? 'Show on portfolio' : 'Hide from portfolio'}>
                  <i className={`fas fa-${project.visible === false ? 'eye-slash' : 'eye'}`} />
                </button>
                <button className="btn btn-sm" onClick={() => setEditingIdx(editingIdx === i ? null : i)}>
                  <i className={`fas fa-${editingIdx === i ? 'chevron-up' : 'pencil'}`} />
                </button>
                <button className="btn btn-sm" onClick={() => moveProject(i, -1)} disabled={i === 0}>
                  <i className="fas fa-chevron-up" />
                </button>
                <button className="btn btn-sm" onClick={() => moveProject(i, 1)} disabled={i === projects.length - 1}>
                  <i className="fas fa-chevron-down" />
                </button>
                <button className="btn btn-sm" onClick={() => duplicateProject(i)}>
                  <i className="fas fa-copy" />
                </button>
                <button className={`btn btn-sm ${pendingDelete === i ? 'btn-danger' : ''}`} onClick={() => removeProject(i)}>
                  <i className={`fas fa-${pendingDelete === i ? 'times' : 'trash'}`} />
                </button>
              </div>
            </div>

            {editingIdx === i && (
              <div className="list-item-content" style={{ marginTop: 8 }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Emoji Icon</label>
                    <input className="form-input" value={project.icon} onChange={e => updateProject(i, 'icon', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input className="form-input" value={project.date} onChange={e => updateProject(i, 'date', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Title</label>
                    <EnhanceButton text={project.title} contextType="project.title" onEnhanced={v => updateProject(i, 'title', v)} showToast={showToast} />
                  </div>
                  <input className="form-input" value={project.title} onChange={e => updateProject(i, 'title', e.target.value)} />
                </div>
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Description</label>
                    <EnhanceButton text={project.description} contextType="project.description" onEnhanced={v => updateProject(i, 'description', v)} showToast={showToast} />
                  </div>
                  <textarea className="form-textarea" rows={3} value={project.description} onChange={e => updateProject(i, 'description', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Tags</label>
                  <TagInput tags={project.tags} onChange={val => updateProject(i, 'tags', val)} />
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub URL (optional)</label>
                  <input className="form-input" value={project.github} onChange={e => updateProject(i, 'github', e.target.value)} placeholder="https://github.com/..." />
                </div>
              </div>
            )}

            {editingIdx !== i && project.tags.length > 0 && (
              <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                {project.tags.map((tag, ti) => (
                  <span key={ti} className="tag" style={{ fontSize: 11 }}>{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      {pendingDelete !== null && (
        <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: 8 }}>
          Click <strong>trash</strong> on an item to delete it. Click again to confirm.
        </div>
      )}
    </div>
  )
}

export default ProjectsEditor
