import { useState } from 'react'
import { ask } from '../api.js'

const STYLES = ['Rasmiy', "Do'stona", 'Reklama', 'Ijtimoiy tarmoq posti']

export default function Writer() {
  const [topic, setTopic] = useState('')
  const [style, setStyle] = useState(STYLES[0])
  const [out, setOut] = useState('')
  const [busy, setBusy] = useState(false)

  async function run() {
    if (!topic.trim() || busy) return
    setBusy(true)
    setOut('...')
    try {
      setOut(await ask([{ role: 'user', content: `Quyidagi mavzu bo'yicha "${style}" uslubida matn yoz:\n${topic}` }]))
    } catch (e) {
      setOut('Xatolik: ' + e.message)
    }
    setBusy(false)
  }

  return (
    <>
      <label>Nima haqida yozay?</label>
      <textarea value={topic} onChange={(e) => setTopic(e.target.value)}
        placeholder="Masalan: yangi qahvaxona ochilishi haqida e'lon" />
      <label>Uslub</label>
      <select value={style} onChange={(e) => setStyle(e.target.value)}>
        {STYLES.map((s) => <option key={s}>{s}</option>)}
      </select>
      <div style={{ marginTop: 12 }}>
        <button className="go" onClick={run} disabled={busy}>Yozish</button>
      </div>
      <div className="out">{out}</div>
    </>
  )
}
