import { useState, useContext } from 'react'
import { AiBusyContext } from '../context'

const API_BASE = window.location.origin

export default function EnhanceButton({ text, contextType, onEnhanced, showToast, sectionsContext, tool }) {
  const { aiBusy, setAiBusy } = useContext(AiBusyContext)
  const [loading, setLoading] = useState(false)

  const enhance = async () => {
    if (!text?.trim() || aiBusy) return
    setLoading(true)
    setAiBusy(true)
    try {
      const res = await fetch(`${API_BASE}/api/enhance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, contextType, ...(sectionsContext ? { sectionsContext } : {}), ...(tool ? { tool } : {}) }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Enhancement failed')
      onEnhanced(data.result)
      showToast?.('Text enhanced')
    } catch (err) {
      showToast?.(err.message, 'danger')
    } finally {
      setLoading(false)
      setAiBusy(false)
    }
  }

  return (
    <button
      className="btn btn-sm btn-icon"
      onClick={enhance}
      disabled={loading || aiBusy || !text?.trim()}
      title={aiBusy ? 'AI is busy...' : 'Enhance with AI'}
      style={{ fontSize: 12, padding: '4px 7px', minWidth: 28 }}
    >
      <i className={`fas fa-${loading ? 'spinner fa-spin' : aiBusy ? 'ban' : 'wand-magic-sparkles'}`} />
    </button>
  )
}
