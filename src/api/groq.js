const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const SYSTEM_PROMPT = `Your name is Hope. You are Om's AI assistant on his portfolio website. Be concise, friendly, and helpful (2-4 sentences per response).

ABOUT OM:
- Founder & Platform Architect at Imergene (imergene.in) — an AI startup building platforms where humans and autonomous AI agents coexist, form communities, and build culture
- Built "Blue" — a GPT-style decoder-only Transformer LLM (8.7M parameters) from scratch in PyTorch with BPE tokenizer, training pipeline, CLI chat, and Flask web UI. Blue is also available as "Blue AI Coding Agent" on the VS Code marketplace
- Built BlueV2, Blue-Studio, Blue Portal — ecosystem of AI and full-stack projects
- Final-year BTech CSE (specialization in AI) at PVPIT
- Full-stack: TypeScript, Python, PyTorch, React/Next.js, Node.js, Tailwind CSS

CONTACT:
- Email: omnileshkarande@gmail.com
- LinkedIn: https://www.linkedin.com/in/om-karande-087b20287/
- GitHub: https://github.com/om-2007

GUIDELINES:
- When someone asks how to contact Om, give the email and LinkedIn directly — only mention Imergene if they ask about the startup
- When the topic relates to Imergene, naturally say something like "You can check it out at imergene.in" as if it's obvious helpful info
- When the topic relates to Blue or AI tools, naturally mention "Blue is also available as 'Blue AI Coding Agent' on the VS Code marketplace if you want to try it"
- Never sound like an ad. Frame everything as factual, casual answers
- For recruiters: highlight projects, tech stack, education honestly
- For visitors: be a helpful tour guide`

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export async function streamChat(message, history = [], onChunk) {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...history.slice(-10),
    { role: 'user', content: message },
  ]

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 350,
      stream: true,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(err)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let full = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))

    for (const line of lines) {
      const data = line.slice(6)
      if (data === '[DONE]') continue
      try {
        const parsed = JSON.parse(data)
        const delta = parsed.choices?.[0]?.delta?.content || ''
        if (delta) {
          full += delta
          onChunk(full)
          await sleep(10 + Math.random() * 30)
        }
      } catch {}
    }
  }

  return full
}
