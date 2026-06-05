import express from 'express'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, 'portfolio.json')

const app = express()
app.use(express.json({ limit: '10mb' }))

app.get('/api/data', (_req, res) => {
  try {
    if (!existsSync(DATA_FILE)) return res.json({})
    res.json(JSON.parse(readFileSync(DATA_FILE, 'utf-8')))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.put('/api/data', (req, res) => {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2), 'utf-8')
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const OPENCODE_AVAILABLE = (() => {
  try { execSync('which opencode', { encoding: 'utf-8' }); return true }
  catch { return false }
})()

function callOpencode(prompt) {
  const result = execSync(
    `opencode run --dangerously-skip-permissions --format json ${JSON.stringify(prompt)}`,
    { timeout: 60000, maxBuffer: 1024 * 1024, encoding: 'utf-8' }
  )
  const lines = result.split('\n').filter(l => l.trim())
  for (const line of lines) {
    try {
      const parsed = JSON.parse(line)
      if (parsed.type === 'text' && parsed.part?.text) {
        return parsed.part.text.trim()
      }
    } catch {}
  }
  const cleaned = lines.filter(l => !l.startsWith('>') && !l.startsWith('{'))
  return cleaned.join('\n').trim()
}

function callGemini(prompt) {
  const result = execSync(
    `gemini ask ${JSON.stringify(prompt)}`,
    { timeout: 60000, maxBuffer: 1024 * 1024, encoding: 'utf-8' }
  )
  return result.trim()
}

app.post('/api/enhance', async (req, res) => {
  const { text, contextType, sectionsContext, tool } = req.body
  if (!text?.trim()) return res.status(400).json({ error: 'No text provided' })

  const isProjectDesc = contextType === 'project.description'
  let fullPrompt = `You are a text enhancement assistant for a portfolio website.
Enhance the following text by:
1. Fixing spelling and grammar
2. Improving tone to be professional yet friendly
3. Adding appropriate emoji where it fits naturally
4. ${isProjectDesc ? 'Expanding it into 2-3 detailed sentences that describe what the project does, how it was built, and what makes it interesting' : 'Keeping the same length and meaning'}
5. ${isProjectDesc ? 'Be specific — mention technologies, algorithms, or approaches used. Write in past tense, like a portfolio accomplishment.' : ''}

Context: this is a "${contextType || 'text'}" field on a portfolio site.

${isProjectDesc ? `
Good example:
"Built a deep reinforcement learning model using DDPG and PPO to optimize irrigation policies. Designed a custom Gym environment integrated with DSSAT crop simulation data. Compared multiple RL algorithms across water usage and yield metrics."

Write in that style — detailed, technical, and accomplishment-oriented.` : ''}`

  if (sectionsContext) {
    fullPrompt += `\n\nThe user's full portfolio data for context:\n${sectionsContext}`
  }

  fullPrompt += `\n\nReturn ONLY the enhanced text, with no explanation, no quotes, no prefix.

Text to enhance:
"""${text}"""`

  try {
    let enhanced
    if (tool === 'gemini') {
      enhanced = callGemini(fullPrompt)
    } else {
      if (!OPENCODE_AVAILABLE) {
        return res.status(500).json({ error: 'opencode CLI not found. Install it or switch to gemini.' })
      }
      enhanced = callOpencode(fullPrompt)
    }
    res.json({ result: enhanced || text })
  } catch (err) {
    let msg = err.message
    if (msg.includes('timed out')) msg = 'Enhancement timed out. Try again.'
    else if (msg.includes('command not found')) msg = 'Selected CLI tool not found.'
    res.status(500).json({ error: msg })
  }
})

app.post('/api/ai', async (req, res) => {
  const { prompt, tool } = req.body
  if (!prompt?.trim()) return res.status(400).json({ error: 'No prompt provided' })

  try {
    let result
    if (tool === 'gemini') {
      result = callGemini(prompt)
    } else {
      if (!OPENCODE_AVAILABLE) {
        return res.status(500).json({ error: 'opencode CLI not found. Install it or switch to gemini.' })
      }
      result = callOpencode(prompt)
    }
    res.json({ result: result || '' })
  } catch (err) {
    let msg = err.message
    if (msg.includes('timed out')) msg = 'Request timed out. Try again.'
    res.status(500).json({ error: msg })
  }
})

async function start() {
  const PORT = process.env.PORT || 3333
  const isDev = process.env.NODE_ENV !== 'production'

  const portfolioDir = join(__dirname, '..')
  app.get('/portfolio', (req, res) => res.sendFile(join(portfolioDir, 'index.html')))
  app.get('/portfolio/', (req, res) => res.sendFile(join(portfolioDir, 'index.html')))
  app.get('/portfolio/index.html', (req, res) => res.sendFile(join(portfolioDir, 'index.html')))
  app.use('/portfolio', express.static(portfolioDir))

  if (isDev) {
    const { createServer: createVite } = await import('vite')
    const vite = await createVite({
      server: { middlewareMode: true },
      appType: 'spa',
    })
    app.use(vite.middlewares)
  } else {
    app.use(express.static(join(__dirname, 'dist')))
    app.get('*', (_req, res) => {
      res.sendFile(join(__dirname, 'dist', 'index.html'))
    })
  }

  app.listen(PORT, () => {
    console.log(`Portfolio Admin running at http://localhost:${PORT}`)
  })
}

start()
