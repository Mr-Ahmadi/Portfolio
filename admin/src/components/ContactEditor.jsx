import EnhanceButton from './EnhanceButton'

function ContactEditor({ data, updateData, showToast }) {
  const contact = data.contact

  return (
    <div className="section-editor">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Contact Information</div>
            <div className="card-subtitle">Edit your contact details</div>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" value={contact.email} onChange={e => updateData('contact.email', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={contact.phone} onChange={e => updateData('contact.phone', e.target.value)} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">GitHub Username</label>
            <input className="form-input" value={contact.github} onChange={e => updateData('contact.github', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">LinkedIn Name</label>
            <input className="form-input" value={contact.linkedin} onChange={e => updateData('contact.linkedin', e.target.value)} />
          </div>
        </div>

        <h3 style={{ margin: '20px 0 12px', fontSize: 13, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: 0.5 }}>
          Intro Text
        </h3>
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Heading</label>
            <EnhanceButton text={contact.intro.heading} contextType="contact.heading" onEnhanced={v => updateData('contact.intro.heading', v)} showToast={showToast} />
          </div>
          <input className="form-input" value={contact.intro.heading} onChange={e => updateData('contact.intro.heading', e.target.value)} />
        </div>
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Description</label>
            <EnhanceButton text={contact.intro.text} contextType="contact.intro" onEnhanced={v => updateData('contact.intro.text', v)} showToast={showToast} />
          </div>
          <textarea className="form-textarea" rows={3} value={contact.intro.text} onChange={e => updateData('contact.intro.text', e.target.value)} />
        </div>
      </div>
    </div>
  )
}

export default ContactEditor
