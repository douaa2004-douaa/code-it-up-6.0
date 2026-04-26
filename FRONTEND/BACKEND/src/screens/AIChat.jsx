import { useState, useRef, useEffect } from 'react'
import PageHeader from '../widgets/PageHeader'
import { useToast } from '../widgets/Toast'

const SYSTEM_PROMPT = `You are Sandy-GPT, the AI assistant for Sandy Cheeks' underwater laboratory in Bikini Bottom. 
You are helpful, enthusiastic, and speak with a Texan flair (occasional "y'all", "partner", "howdy").
You assist with lab management: projects, experiments, inventory, and scientific analysis.
Keep responses concise, friendly, and scientifically accurate. Use relevant emojis sparingly.`

const SUGGESTIONS = [
  "What's the lab status?",
  'Analyze our kelp bioreactor data',
  'Check inventory alerts',
  'Suggest experiment improvements',
]

export default function AIChat() {
  const toast = useToast()
  const [messages, setMessages] = useState([
    {
      id: 0, role: 'assistant',
      text: "Howdy partner! 🤠 I'm Sandy-GPT, your AI lab assistant. Ask me anything about projects, inventory, experiments, or lab science!",
      ts: new Date(),
    }
  ])
  const [input, setInput]       = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, thinking])

  async function send(text) {
    const msg = (text || input).trim()
    if (!msg || thinking) return
    setInput('')

    const userMsg = { id: Date.now(), role: 'user', text: msg, ts: new Date() }
    setMessages(prev => [...prev, userMsg])
    setThinking(true)

    // Build history for API (exclude system turn)
    const history = [...messages, userMsg]
      .filter(m => m.id !== 0)
      .map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history,
        }),
      })

      if (!res.ok) throw new Error(`API error ${res.status}`)

      const data = await res.json()
      const reply = data.content?.find(b => b.type === 'text')?.text || '…'

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: reply,
        ts: new Date(),
      }])
    } catch (err) {
      console.error(err)
      toast('Sandy-GPT encountered an error. Check your connection.', 'danger')
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        text: "Well, shucks! 🤠 Looks like my connection to the surface got a bit tangled. Try again in a moment, partner!",
        ts: new Date(),
      }])
    } finally {
      setThinking(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="page-enter flex flex-col" style={{ height: 'calc(100vh - 57px)' }}>
      {/* Header */}
      <div className="p-6 pb-2 flex-shrink-0">
        <PageHeader icon="🤖" title="Sandy-GPT" subtitle="Real AI — powered by Claude" />
      </div>

      {/* Suggestions */}
      <div className="px-6 flex flex-wrap gap-2 mb-3 flex-shrink-0">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => send(s)}
            className="text-xs px-3 py-1.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-blue-300 transition font-semibold">
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-3">
        {messages.map(m => (
          <div key={m.id} className={`flex items-end gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="bubble-deco w-9 h-9 flex-shrink-0 flex items-center justify-center text-lg">
              {m.role === 'assistant' ? '🦦' : '👤'}
            </div>
            <div
              className="max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
              style={m.role === 'assistant'
                ? { background:'rgba(0,57,90,0.75)', border:'1px solid rgba(0,188,212,0.3)', color:'#e0f7fa', borderBottomLeftRadius:4 }
                : { background:'linear-gradient(135deg,#00bcd4,#0097a7)', color:'white', borderBottomRightRadius:4, boxShadow:'0 4px 15px rgba(0,188,212,0.35)' }
              }
            >
              {m.text}
              <div className="text-[10px] opacity-40 mt-1 text-right">
                {m.ts.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex items-end gap-3">
            <div className="bubble-deco w-9 h-9 flex-shrink-0 flex items-center justify-center text-lg">🦦</div>
            <div className="px-5 py-3 rounded-2xl"
              style={{ background:'rgba(0,57,90,0.75)', border:'1px solid rgba(0,188,212,0.3)', borderBottomLeftRadius:4 }}>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-cyan-400"
                      style={{ animation:`bounce 1s ease-in-out ${i*0.15}s infinite` }} />
                  ))}
                </div>
                <span className="text-xs text-blue-400">Sandy-GPT is thinking…</span>
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-2 flex-shrink-0 border-t border-white/10">
        <div className="glass-card flex items-center gap-3 p-2 pl-4 mt-3">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask Sandy-GPT anything about the lab…"
            rows={1}
            className="flex-1 bg-transparent text-white placeholder-blue-400 text-sm outline-none resize-none"
            style={{ maxHeight: 100 }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || thinking}
            className="btn-glow text-white font-bold px-5 py-2.5 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            Send 🚀
          </button>
        </div>
      </div>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }`}</style>
    </div>
  )
}
