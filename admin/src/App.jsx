import { useState, useEffect, useCallback, useRef } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import HeroEditor from './components/HeroEditor'
import AboutEditor from './components/AboutEditor'
import ExperienceEditor from './components/ExperienceEditor'
import ProjectsEditor from './components/ProjectsEditor'
import ContactEditor from './components/ContactEditor'
import GitHubIntegration from './components/GitHubIntegration'
import AITextHelper from './components/AITextHelper'
import { AiBusyContext } from './context'

const API_BASE = window.location.origin
const ACTIVE_TAB_KEY = 'admin-tab'

async function fetchData() {
  const res = await fetch(`${API_BASE}/api/data`)
  if (!res.ok) throw new Error('Server unavailable')
  return res.json()
}

async function saveData(data) {
  const res = await fetch(`${API_BASE}/api/data`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return res.ok
}

function App() {
  const [data, setData] = useState(null)
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem(ACTIVE_TAB_KEY) || 'dashboard'
  })
  const [toast, setToast] = useState(null)
  const [dirty, setDirty] = useState(false)
  const [aiBusy, setAiBusy] = useState(false)
  const pastStates = useRef([])
  const MAX_HISTORY = 50

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 2500)
  }, [])

  useEffect(() => {
    fetchData().then(serverData => {
      setData(serverData)
    }).catch(() => {
      showToast('Could not load portfolio.json from server', 'danger')
    })
  }, [])

  useEffect(() => {
    localStorage.setItem(ACTIVE_TAB_KEY, activeTab)
  }, [activeTab])

  const updateData = useCallback((path, value) => {
    setData(prev => {
      pastStates.current = [structuredClone(prev), ...pastStates.current].slice(0, MAX_HISTORY)
      const keys = path.split('.')
      const newData = structuredClone(prev)
      let obj = newData
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return newData
    })
    setDirty(true)
  }, [])

  const save = useCallback(async () => {
    try {
      const ok = await saveData(data)
      if (ok) {
        setDirty(false)
        showToast('Saved')
      }
    } catch {
      showToast('Save failed', 'danger')
    }
  }, [data, showToast])

  const undo = useCallback(() => {
    if (pastStates.current.length === 0) {
      showToast('Nothing to undo', 'danger')
      return
    }
    const [prev, ...rest] = pastStates.current
    pastStates.current = rest
    setData(prev)
    showToast('Undo')
  }, [showToast])

  const revertAll = useCallback(async () => {
    try {
      const serverData = await fetchData()
      pastStates.current = []
      setDirty(false)
      setData(serverData)
      showToast('Reverted all changes')
    } catch {
      showToast('Could not fetch saved data', 'danger')
    }
  }, [showToast])

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          revertAll()
        } else {
          undo()
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        save()
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        revertAll()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, revertAll, save])

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'portfolio-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [data])

  if (!data) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)', color: 'var(--text-muted)' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: 32, marginBottom: 12 }} />
          <div>Loading portfolio data...</div>
        </div>
      </div>
    )
  }

  const tabs = {
    dashboard: { label: 'Dashboard', icon: 'fa-gauge-high', component: Dashboard },
    hero: { label: 'Hero', icon: 'fa-house', component: HeroEditor },
    about: { label: 'About', icon: 'fa-user', component: AboutEditor },
    experience: { label: 'Experience', icon: 'fa-briefcase', component: ExperienceEditor },
    projects: { label: 'Projects', icon: 'fa-code', component: ProjectsEditor },
    contact: { label: 'Contact', icon: 'fa-envelope', component: ContactEditor },
    github: { label: 'GitHub', icon: 'fa-github', iconPrefix: 'fab', component: GitHubIntegration },
    ai: { label: 'AI Helper', icon: 'fa-wand-magic-sparkles', component: AITextHelper },
  }

  const ActiveComponent = tabs[activeTab]?.component || Dashboard

  return (
    <div className="app-layout">
      <Sidebar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} data={data} />
      <main className="main-content">
        <div className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="topbar-title">{tabs[activeTab]?.label || 'Dashboard'}</span>
            {dirty && (
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(255,159,10,0.15)', color: 'var(--warning)' }}>
                <i className="fas fa-pen" style={{ marginRight: 3 }} /> unsaved
              </span>
            )}
          </div>
          <div className="topbar-actions">
            <button className="btn btn-sm btn-primary" onClick={save} disabled={!dirty} title="Save changes (Ctrl+S)">
              <i className="fas fa-floppy-disk" /> Save
            </button>
            <button className="btn btn-sm btn-danger" onClick={revertAll} title="Revert all changes (Esc)">
              <i className="fas fa-undo" /> Revert All
            </button>
            <button className="btn btn-sm" onClick={exportData}>
              <i className="fas fa-download" /> Export
            </button>
          </div>
        </div>
        <div className="page-content">
          <AiBusyContext.Provider value={{ aiBusy, setAiBusy }}>
            <ActiveComponent data={data} updateData={updateData} showToast={showToast} />
          </AiBusyContext.Provider>
        </div>
      </main>
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}

export default App
