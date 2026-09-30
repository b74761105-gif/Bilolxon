// Netlify'da server.js o'rniga shu funksiya /api/ask so'rovlarini qabul qiladi.
const MODEL = process.env.MODEL || 'glm-4.5-flash'

export default async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'POST kerak' }, { status: 405 })
  }
  try {
    const { messages, system } = await req.json()
    if (!Array.isArray(messages) || !messages.length) {
      return Response.json({ error: 'messages kerak' }, { status: 400 })
    }
    const key = process.env.ZAI_API_KEY
    if (!key) {
      return Response.json(
        { error: "ZAI_API_KEY Netlify'da (Environment variables) yo'q" },
        { status: 500 },
      )
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
    if (!r.ok) {
      return Response.json({ error: data.error?.message || 'API xatosi' }, { status: r.status })
    }
    const text = data.choices?.[0]?.message?.content || ''
    if (!text) return Response.json({ error: "Javob bo'sh keldi" }, { status: 502 })
    return Response.json({ text })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

export const config = { path: '/api/ask' }
