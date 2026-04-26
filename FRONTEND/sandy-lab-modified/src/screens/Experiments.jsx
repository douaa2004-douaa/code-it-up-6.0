import { useState } from 'react'
import PageHeader from '../widgets/PageHeader'
import Badge from '../widgets/Badge'

const EXPERIMENTS = [
  { id:'EXP-042', name:'Kelp extract synthesis v3',       project:'Kelp Bioreactor',    status:'completed', date:'2025-06-20', duration:'4h 12m', lead:'Sandy Cheeks', result:'✅ Success — yield 94%',           notes:'Optimal pH was 6.8. Temperature held at 24°C.' },
  { id:'EXP-041', name:'Bubble pressure test at 200m',    project:'Bubble Drive',       status:'completed', date:'2025-06-19', duration:'2h 05m', lead:'Sandy Cheeks', result:'✅ Success — pressure held',        notes:'No cracks. Seal integrity 100%.' },
  { id:'EXP-040', name:'Acorn fermentation trial 2',      project:'Acorn Fuel Cell',    status:'failed',    date:'2025-06-18', duration:'6h 30m', lead:'Sandy Cheeks', result:'❌ Failed — contamination',         notes:'Sample contaminated. Retry with fresh culture.' },
  { id:'EXP-039', name:'AI agent training batch 5',       project:'Sandy AI Core',      status:'running',   date:'2025-06-21', duration:'—',      lead:'AI Agent',     result:'⏳ In progress…',                  notes:'Epoch 312/1000. Loss: 0.0312.' },
  { id:'EXP-038', name:'Bubble resonance frequency test', project:'Bubble Drive',       status:'completed', date:'2025-06-17', duration:'1h 48m', lead:'SpongeBob',    result:'✅ Success — freq 42.7 Hz',        notes:'Resonance achieved at 42.7 Hz.' },
  { id:'EXP-037', name:'NaCl concentration gradient',     project:'Kelp Bioreactor',    status:'paused',    date:'2025-06-16', duration:'—',      lead:'Sandy Cheeks', result:'⏸️ Paused — low stock NaCl',      notes:'Waiting on restock.' },
]

const STATUS_MAP = { completed:'success', failed:'danger', running:'info', paused:'warning' }

export default function Experiments() {
  const [expanded, setExpanded] = useState(null)
  const [filter, setFilter]     = useState('all')

  const filtered = EXPERIMENTS.filter(e => filter === 'all' || e.status === filter)

  return (
    <div className="page-enter p-6 max-w-7xl mx-auto">
      <PageHeader
        icon="📋"
        title="Experiments & Logs"
        subtitle="Track every experiment and its outcomes"
        actions={
          <button className="btn-glow text-white font-bold px-5 py-2.5 rounded-2xl text-sm">
            + Log Experiment
          </button>
        }
      />

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        {['all','completed','running','failed','paused'].map(f => {
          const count = f === 'all' ? EXPERIMENTS.length : EXPERIMENTS.filter(e => e.status === f).length
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-2xl text-sm font-semibold capitalize transition-all flex items-center gap-2 ${
                filter === f ? 'btn-glow text-white' : 'bg-white/10 text-blue-300 hover:bg-white/15'
              }`}
            >
              {f}
              <span className="text-xs opacity-70 bg-white/10 px-1.5 py-0.5 rounded-full">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Log entries */}
      <div className="space-y-3">
        {filtered.map(exp => (
          <div key={exp.id} className="glass-card overflow-hidden">
            {/* Row */}
            <div
              className="flex flex-wrap items-center gap-4 p-4 cursor-pointer hover:bg-white/5 transition-colors"
              onClick={() => setExpanded(expanded === exp.id ? null : exp.id)}
            >
              <span className="font-mono text-xs text-cyan-400 font-bold w-20">{exp.id}</span>
              <div className="flex-1 min-w-[200px]">
                <p className="font-semibold text-white text-sm">{exp.name}</p>
                <p className="text-xs text-blue-400">{exp.project}</p>
              </div>
              <Badge label={exp.status} variant={STATUS_MAP[exp.status]} />
              <div className="text-xs text-blue-400 text-right">
                <div>{exp.date}</div>
                <div>{exp.duration}</div>
              </div>
              <div className="text-blue-400 text-lg">{expanded === exp.id ? '▲' : '▼'}</div>
            </div>

            {/* Expanded detail */}
            {expanded === exp.id && (
              <div className="border-t border-white/10 p-5 grid grid-cols-1 md:grid-cols-2 gap-5 bg-white/5">
                <div>
                  <p className="text-xs text-blue-400 font-bold uppercase mb-1">Result</p>
                  <p className="text-sm text-white font-semibold">{exp.result}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-400 font-bold uppercase mb-1">Notes</p>
                  <p className="text-sm text-blue-100">{exp.notes}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-400 font-bold uppercase mb-1">Lead Researcher</p>
                  <p className="text-sm text-white">👤 {exp.lead}</p>
                </div>
                <div>
                  <p className="text-xs text-blue-400 font-bold uppercase mb-1">Duration</p>
                  <p className="text-sm text-white">⏱ {exp.duration}</p>
                </div>
                <div className="md:col-span-2 flex gap-3">
                  <button className="btn-glow text-white text-xs font-bold px-4 py-2 rounded-xl">📄 Full Report</button>
                  <button className="bg-white/10 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-white/15 transition">✏️ Edit Log</button>
                  <button className="bg-white/10 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-white/15 transition">🤖 Ask AI</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
