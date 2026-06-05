function Dashboard({ data }) {
  const stats = [
    { label: 'Projects', value: data.projects?.length || 0 },
    { label: 'Research Positions', value: data.experience?.research?.length || 0 },
    { label: 'Teaching Positions', value: data.experience?.teaching?.length || 0 },
    { label: 'Certificates', value: data.experience?.certificates?.length || 0 },
    { label: 'Publications', value: data.experience?.publications?.length || 0 },
    { label: 'Skills', value: (data.about?.skills?.languages?.length || 0) + (data.about?.skills?.technologies?.length || 0) },
    { label: 'Interests', value: data.about?.interests?.length || 0 },
  ]

  return (
    <div>
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 18, marginBottom: 4 }}>Welcome to Portfolio Admin</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Use the sidebar to edit each section of your portfolio.
          Data is saved automatically to <code>portfolio.json</code>.
        </p>
      </div>

      <div className="stat-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Quick Preview</div>
            <div className="card-subtitle">Current portfolio summary</div>
          </div>
        </div>
        <div style={{ fontSize: 13, lineHeight: 1.8 }}>
          <strong>Name:</strong> {data.hero?.name}<br />
          <strong>Tagline:</strong> {data.hero?.tagline}<br />
          <strong>Email:</strong> {data.about?.personalInfo?.email}<br />
          <strong>GitHub:</strong> {data.contact?.github}<br />
          <strong>LinkedIn:</strong> {data.contact?.linkedin}<br />
          <strong>Total Projects:</strong> {data.projects?.length || 0}<br />
          <strong>Total Experience Entries:</strong> {
            (data.experience?.research?.length || 0) +
            (data.experience?.teaching?.length || 0) +
            (data.experience?.certificates?.length || 0) +
            (data.experience?.publications?.length || 0)
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard
