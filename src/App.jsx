import { useState } from 'react'
import Chat from './components/Chat.jsx'
import Writer from './components/Writer.jsx'
import Translator from './components/Translator.jsx'

const TABS = [
  { id: 'chat', label: 'Chatbot', View: Chat },
  { id: 'write', label: 'Matn yozuvchi', View: Writer },
  { id: 'tr', label: 'Tarjimon', View: Translator },
]

export default function App() {
  const [tab, setTab] = useState('chat')
  return (
    <div className="wrap">
      <img className="logo" src="/logo.png" alt="Yakore.AI" />
      <h1 className="sr">Yakore.AI</h1>
      <p className="sub">Suhbat, matn yozish va tarjima — bitta joyda.</p>
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {TABS.map(({ id, View }) => (
        <div key={id} className="card" style={{ display: tab === id ? 'block' : 'none' }}>
          <View />
        </div>
      ))}
    </div>
  )
}
