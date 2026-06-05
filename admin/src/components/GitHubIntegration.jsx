import { useState } from 'react'

const GITHUB_TOKEN_KEY = 'portfolio-github-token'
const SELECTED_REPOS_KEY = 'portfolio-selected-repos'

const API_BASE = window.location.origin

const LANG_EMOJI = {
  JavaScript: '🟨',
  TypeScript: '🔷',
  Python: '🐍',
  Java: '☕',
  'C++': '⚙️',
  C: '⚙️',
  'C#': '🎯',
  Ruby: '💎',
  Go: '🔵',
  Rust: '🦀',
  Swift: '🍎',
  Kotlin: '🟣',
  PHP: '🐘',
  HTML: '🌐',
  CSS: '🎨',
  Shell: '💻',
  Dockerfile: '🐳',
  'Jupyter Notebook': '📓',
  TeX: '📝',
  R: '📊',
  Scala: '🔴',
  Dart: '🎯',
  Lua: '🌙',
  Haskell: 'λ',
  Elixir: '💜',
  Vue: '💚',
  Svelte: '🧡',
  Solid: '🔵',
  Zig: '⚡',
  Nix: '❄️',
}

function repoEmoji(repo) {
  if (!repo) return '📁'
  if (repo.language && LANG_EMOJI[repo.language]) return LANG_EMOJI[repo.language]
  const name = (repo.name || repo.full_name || '').toLowerCase()
  if (name.includes('ai') || name.includes('ml') || name.includes('deep')) return '🤖'
  if (name.includes('web') || name.includes('site') || name.includes('app')) return '🌐'
  if (name.includes('api') || name.includes('server')) return '⚡'
  if (name.includes('data') || name.includes('bio')) return '🧬'
  if (name.includes('rl') || name.includes('reinforce')) return '🎮'
  if (name.includes('vision') || name.includes('image')) return '👁️'
  if (name.includes('tool') || name.includes('util')) return '🔧'
  if (name.includes('bot')) return '🤖'
  if (name.includes('cli') || name.includes('terminal')) return '💻'
  if (name.includes('react')) return '⚛️'
  if (name.includes('docker')) return '🐳'
  if (name.includes('test')) return '🧪'
  if (name.includes('game') || name.includes('play')) return '🎮'
  if (name.includes('mobile') || name.includes('ios') || name.includes('android')) return '📱'
  if (name.includes('plugin') || name.includes('extension')) return '🔌'
  if (name.includes('theme') || name.includes('ui')) return '🎨'
  if (name.includes('sort') || name.includes('search') || name.includes('algo')) return '🔍'
  if (name.includes('note') || name.includes('doc') || name.includes('paper')) return '📄'
  if (name.includes('template') || name.includes('starter')) return '🚀'
  if (name.includes('config') || name.includes('dotfile')) return '⚙️'
  return '📁'
}

function GitHubIntegration({ data, updateData, showToast }) {
  const [token, setToken] = useState(() => localStorage.getItem(GITHUB_TOKEN_KEY) || '')
  const [repos, setRepos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('portfolio-github-repos')) || [] }
    catch { return [] }
  })
  const [enhancedRepos, setEnhancedRepos] = useState(() => {
    try { return JSON.parse(localStorage.getItem('portfolio-github-enhanced')) || {} }
    catch { return {} }
  })
  const [selectedRepos, setSelectedRepos] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SELECTED_REPOS_KEY)) || [] }
    catch { return [] }
  })
  const [loading, setLoading] = useState(false)
  const [enhancing, setEnhancing] = useState(false)
  const [error, setError] = useState('')

  const saveToken = () => {
    localStorage.setItem(GITHUB_TOKEN_KEY, token)
    showToast('Token saved')
  }

  const fetchRepos = async () => {
    if (!token.trim()) {
      setError('Please enter a GitHub personal access token')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated&direction=desc', {
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        throw new Error(errData.message || `HTTP ${res.status}: ${res.statusText}`)
      }

      const raw = await res.json()
      const formatted = raw.map(r => ({
        id: r.id,
        name: r.name,
        full_name: r.full_name,
        description: r.description,
        html_url: r.html_url,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        topics: r.topics || [],
        updated_at: r.updated_at,
      }))

      setRepos(formatted)
      setEnhancedRepos({})
      localStorage.setItem('portfolio-github-repos', JSON.stringify(formatted))
      localStorage.removeItem('portfolio-github-enhanced')
      showToast(`Fetched ${formatted.length} repositories`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const enhanceWithAI = async () => {
    if (repos.length === 0) {
      setError('Fetch repositories first')
      return
    }
    setEnhancing(true)
    setError('')

    const repoList = repos.map(r =>
      `- ${r.full_name} (${r.language || 'unknown'}): ${r.description || 'no description'} — topics: ${r.topics.join(', ') || 'none'}`
    ).join('\n')

    const prompt = `I have the following GitHub repositories. For each one, suggest:
1. A single emoji that best represents the project
2. A 2-3 sentence description suitable for a portfolio — be specific about what it does, the approach or technologies used, and why it matters. Write like a real project accomplishment.

Repositories:
${repoList}

Good example description:
"Built a deep reinforcement learning model using DDPG and PPO to optimize irrigation policies. Designed a custom Gym environment integrated with DSSAT crop simulation data. Compared multiple RL algorithms across water usage and yield metrics."

Return ONLY a JSON object where keys are repo full_names (like "owner/repo") and each value is { "emoji": "…", "description": "…" }. No explanation, no markdown.`

    try {
      const res = await fetch(`${API_BASE}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, tool: 'opencode' }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'AI request failed')

      let suggestions
      try {
        suggestions = JSON.parse(json.result)
      } catch {
        const match = json.result.match(/\{[\s\S]*\}/)
        suggestions = match ? JSON.parse(match[0]) : {}
      }

      setEnhancedRepos(suggestions)
      localStorage.setItem('portfolio-github-enhanced', JSON.stringify(suggestions))
      showToast(`AI enhanced ${Object.keys(suggestions).length} repositories`)
    } catch (err) {
      setError(err.message)
    } finally {
      setEnhancing(false)
    }
  }

  const toggleRepo = (repoId) => {
    const updated = selectedRepos.includes(repoId)
      ? selectedRepos.filter(id => id !== repoId)
      : [...selectedRepos, repoId]
    setSelectedRepos(updated)
    localStorage.setItem(SELECTED_REPOS_KEY, JSON.stringify(updated))
  }

  const addSelectedToProjects = () => {
    const selected = repos.filter(r => selectedRepos.includes(r.id))

    const existing = [...data.projects]
    let added = 0
    let replaced = 0

    selected.forEach(r => {
      const ai = enhancedRepos[r.full_name]
      const title = r.name.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
      const newProject = {
        icon: ai?.emoji || repoEmoji(r),
        title,
        date: new Date(r.updated_at).getFullYear().toString(),
        description: ai?.description || r.description || '',
        tags: [...r.topics].filter(Boolean),
        github: r.html_url,
        visible: true,
      }

      const idx = existing.findIndex(p => p.title.toLowerCase() === title.toLowerCase())
      if (idx !== -1) {
        existing[idx] = newProject
        replaced++
      } else {
        existing.push(newProject)
        added++
      }
    })

    updateData('projects', existing)
    const parts = []
    if (added) parts.push(`Added ${added} project${added > 1 ? 's' : ''}`)
    if (replaced) parts.push(`Replaced ${replaced} project${replaced > 1 ? 's' : ''}`)
    showToast(parts.join(', '))
  }

  const selectedCount = selectedRepos.length

  return (
    <div className="section-editor">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">🐙 GitHub Integration</div>
            <div className="card-subtitle">
              Import your GitHub repositories as portfolio projects with AI-powered descriptions and emoji suggestions
            </div>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Personal Access Token</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              className="form-input"
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              placeholder="ghp_..."
              style={{ flex: 1 }}
            />
            <button className="btn btn-sm" onClick={saveToken}>
              <i className="fas fa-floppy-disk" /> Save
            </button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
            Generate a token at GitHub Settings &gt; Developer settings &gt; Personal access tokens (repo scope needed).
            Token is stored locally and never sent anywhere except GitHub API.
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={fetchRepos} disabled={loading}>
            <i className={`fas fa-${loading ? 'spinner fa-spin' : 'rotate'}`} /> {loading ? 'Fetching...' : 'Fetch Repositories'}
          </button>
          {repos.length > 0 && (
            <button className="btn btn-secondary" onClick={enhanceWithAI} disabled={enhancing}>
              <i className={`fas fa-${enhancing ? 'spinner fa-spin' : 'wand-magic-sparkles'}`} /> {enhancing ? 'Enhancing...' : '✨ Enhance with AI'}
            </button>
          )}
          {selectedCount > 0 && (
            <button className="btn btn-success" onClick={addSelectedToProjects}>
              <i className="fas fa-plus" /> Add {selectedCount} to Portfolio
            </button>
          )}
          {repos.length > 0 && (
            <button className="btn btn-sm" onClick={() => { setSelectedRepos([]); localStorage.removeItem(SELECTED_REPOS_KEY) }}>
              Clear Selection
            </button>
          )}
        </div>

        {repos.length > 0 && (
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
              {repos.length} repos &middot; {selectedCount} selected &middot; Click to toggle
              {Object.keys(enhancedRepos).length > 0 && ' &middot; AI enhanced'}
            </div>
            {repos.map(repo => {
              const ai = enhancedRepos[repo.full_name]
              return (
                <div
                  key={repo.id}
                  className={`github-repo ${selectedRepos.includes(repo.id) ? 'selected' : ''}`}
                  onClick={() => toggleRepo(repo.id)}
                >
                  <div className="repo-check">
                    {selectedRepos.includes(repo.id) && <i className="fas fa-check" style={{ fontSize: 11 }} />}
                  </div>
                  <div className="repo-info">
                    <div className="repo-name">
                      <span style={{ marginRight: 6 }}>{ai?.emoji || repoEmoji(repo)}</span>
                      {repo.full_name}
                    </div>
                    <div className="repo-desc">
                      {ai?.description || repo.description || 'No description'}
                      {repo.language && <span> &middot; {repo.language}</span>}
                      {repo.stars > 0 && <span> &middot; {repo.stars} ★</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default GitHubIntegration
