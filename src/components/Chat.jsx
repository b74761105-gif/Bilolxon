import { useEffect, useRef, useState } from 'react'
import { ask } from '../api.js'

export default function Chat() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', content: 'Salom! Men sizga qanday yordam bera olaman?' },
  ])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const logRef = useRef(null)

  useEffect(() => {
    logRef.current?.scrollTo(0, logRef.current.scrollHeight)
  }, [msgs])

  async function send() {
    const q = input.trim()
    if (!q || busy) return
    const next = [...msgs, { role: 'user', content: q }]
    setMsgs(next)
    setInput('')
    setBusy(true)
    try {
      // API birinchi xabar "user" bo'lishini talab qiladi, salomlashuvni tashlab yuboramiz
      const text = await ask(next.slice(1))
      setMsgs([...next, { role: 'assistant', content: text }])
    } catch (e) {
      setMsgs([...next, { role: 'assistant', content: 'Xatolik: ' + e.message }])
    }
    setBusy(false)
  }

  return (
    <>
      <div id="log" ref={logRef}>
        {msgs.map((m, i) => (
          <div key={i} className={'m ' + (m.role === 'user' ? 'me' : 'ai')}>
            {m.content}
          </div>
        ))}
        {busy && <div className="m ai">...</div>}
      </div>
      <div className="row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Xabar yozing..."
        />
        <button className="go" onClick={send} disabled={busy}>Yuborish</button>
      </div>
    </>
  )
}
