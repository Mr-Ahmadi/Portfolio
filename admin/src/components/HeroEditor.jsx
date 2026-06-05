import EnhanceButton from './EnhanceButton'

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

function HeroEditor({ data, updateData, showToast }) {
  const hero = data.hero

  return (
    <div className="section-editor">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Hero Section</div>
            <div className="card-subtitle">Edit your hero/intro section</div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            className="form-input"
            value={hero.name}
            onChange={e => updateData('hero.name', e.target.value)}
          />
        </div>

        <InputWithEnhance
          label="Tagline"
          value={hero.tagline}
          onChange={val => updateData('hero.tagline', val)}
          contextType="hero.tagline"
          showToast={showToast}
        />

        <InputWithEnhance
          label="Bio"
          value={hero.bio}
          onChange={val => updateData('hero.bio', val)}
          contextType="hero.bio"
          showToast={showToast}
          textarea
          rows={4}
        />

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Avatar Emoji</label>
            <input
              className="form-input"
              value={hero.avatar}
              onChange={e => updateData('hero.avatar', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Preview</label>
            <div style={{ fontSize: 40, textAlign: 'center', padding: 8, background: 'var(--bg)', borderRadius: 8, border: '1px solid var(--border)' }}>
              {hero.avatar}
            </div>
          </div>
        </div>

        <h3 style={{ margin: '20px 0 12px' }}>CTA Buttons</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Primary Button Text</label>
            <input
              className="form-input"
              value={hero.ctaPrimary.text}
              onChange={e => updateData('hero.ctaPrimary.text', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Primary Button Link</label>
            <input
              className="form-input"
              value={hero.ctaPrimary.link}
              onChange={e => updateData('hero.ctaPrimary.link', e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Secondary Button Text</label>
            <input
              className="form-input"
              value={hero.ctaSecondary.text}
              onChange={e => updateData('hero.ctaSecondary.text', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Secondary Button Link</label>
            <input
              className="form-input"
              value={hero.ctaSecondary.link}
              onChange={e => updateData('hero.ctaSecondary.link', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroEditor
