export const SYSTEM =
  "Sen foydali AI yordamchisan. Foydalanuvchi qaysi tilda yozsa, o'sha tilda (asosan o'zbek tilida) aniq va qisqa javob ber."

const HINTS = {
  400: "So'rov formati noto'g'ri yoki model nomi xato. .env faylida MODEL= ni tekshiring.",
  401: "API kalit noto'g'ri. .env faylidagi ZAI_API_KEY ni tekshiring.",
  403: "Bu kalitga ruxsat yo'q. Kalitni va akkauntni tekshiring.",
  404: "Model topilmadi. .env faylida MODEL= ni to'g'ri model nomiga o'zgartiring.",
  429: "So'rovlar limiti tugadi (bepul reja cheklangan). Birozdan keyin urinib ko'ring.",
  500: "Z.ai tarafida vaqtinchalik xatolik. Qayta urinib ko'ring.",
  503: "Xizmat hozir band. Birozdan keyin urinib ko'ring.",
}

// messages: [{ role: 'user' | 'assistant', content: string }]
export async function ask(messages, system = SYSTEM) {
  let res
  try {
    res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, system }),
    })
  } catch {
    throw new Error("Serverga ulanib bo'lmadi. `npm run dev` ishlayotganini tekshiring.")
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (HINTS[res.status]) throw new Error(HINTS[res.status])
    if (!data.error) throw new Error("Server javob bermadi. `npm run dev` ishlayotganini tekshiring.")
    throw new Error(data.error)
  }
  return data.text
}
