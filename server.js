import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
app.use(express.json({ limit: '1mb' }))

const MODEL = process.env.MODEL || 'glm-4.5-flash'

// AI so'rovlari shu yerdan o'tadi, API kalit brauzerga chiqmaydi.
app.post('/api/ask', async (req, res) => {
  try {
    const { messages, system } = req.body
    if (!Array.isArray(messages) || !messages.length) {
      return res.status(400).json({ error: 'messages kerak' })
    }
    const key = process.env.ZAI_API_KEY
    if (!key) {
      return res.status(500).json({ error: "ZAI_API_KEY .env faylida yo'q" })
    }
    const body = {
      model: MODEL,
      messages: system ? [{ role: 'system', content: system }, ...messages] : messages,
    }
    const r = await fetch('https://api.z.ai/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(body),
    })
    const data = await r.json()
    if (!r.ok) return res.status(r.status).json({ error: data.error?.message || 'API xatosi' })
    const text = data.choices?.[0]?.message?.content || ''
    if (!text) return res.status(502).json({ error: "Javob bo'sh keldi" })
    res.json({ text })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

// Productionda build qilingan saytni ham shu server beradi.
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist')
app.use(express.static(dist))
app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')))

const port = process.env.PORT || 3001
app.listen(port, () => console.log(`Server: http://localhost:${port}`))
