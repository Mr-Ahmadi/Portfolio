function Sidebar({ tabs, activeTab, onTabChange, data }) {
  const countProjects = data.projects?.length || 0

  const tabList = [
    { key: 'dashboard', ...tabs.dashboard },
    { key: 'hero', ...tabs.hero },
    { key: 'about', ...tabs.about },
    { key: 'experience', ...tabs.experience },
    { key: 'projects', ...tabs.projects, badge: countProjects },
    { key: 'contact', ...tabs.contact },
    { key: 'github', ...tabs.github },
    { key: 'ai', ...tabs.ai },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1>Portfolio Admin</h1>
        <p>Manage your portfolio</p>
      </div>
      <nav className="sidebar-nav">
        {tabList.map(tab => (
          <button
            key={tab.key}
            className={`nav-item ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => onTabChange(tab.key)}
          >
            <i className={`${tab.iconPrefix || 'fas'} ${tab.icon}`} />
            <span>{tab.label}</span>
            {tab.badge != null && <span className="badge">{tab.badge}</span>}
          </button>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
