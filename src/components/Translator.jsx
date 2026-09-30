import { useState } from 'react'
import { ask } from '../api.js'

const LANGS = ["O'zbek", 'Ingliz', 'Rus', 'Turk', 'Koreys']

export default function Translator() {
  const [text, setText] = useState('')
  const [lang, setLang] = useState(LANGS[0])
  const [out, setOut] = useState('')
  const [busy, setBusy] = useState(false)

  async function run() {
    if (!text.trim() || busy) return
    setBusy(true)
    setOut('...')
    try {
      setOut(await ask([{ role: 'user', content: `Quyidagi matnni ${lang} tiliga tarjima qil. Faqat tarjimani yoz:\n${text}` }]))
    } catch (e) {
      setOut('Xatolik: ' + e.message)
    }
    setBusy(false)
  }

  return (
    <>
      <label>Matn</label>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Tarjima qilinadigan matn" />
      <label>Qaysi tilga</label>
      <select value={lang} onChange={(e) => setLang(e.target.value)}>
        {LANGS.map((l) => <option key={l}>{l}</option>)}
      </select>
      <div style={{ marginTop: 12 }}>
        <button className="go" onClick={run} disabled={busy}>Tarjima qilish</button>
      </div>
      <div className="out">{out}</div>
    </>
  )
}
