import { useState } from 'react'
import PageHeader from '../widgets/PageHeader'
import Badge from '../widgets/Badge'

const PROJECTS = [
  { id:1, name:'Bubble Drive',       lead:'Sandy Cheeks', status:'active',   phase:'Testing',    progress:72, due:'2025-08-15', tags:['propulsion','physics'],         desc:'A revolutionary underwater propulsion system using controlled bubble dynamics.' },
  { id:2, name:'Acorn Fuel Cell',    lead:'Sandy Cheeks', status:'active',   phase:'R&D',        progress:45, due:'2025-09-30', tags:['energy','sustainability'],      desc:'Converting acorn biomass into clean hydrogen fuel for Bikini Bottom.' },
  { id:3, name:'Kelp Bioreactor',    lead:'Patrick Star',  status:'active',   phase:'Production', progress:88, due:'2025-07-01', tags:['biology','environment'],        desc:'Large-scale kelp cultivation reactor for food and oxygen production.' },
  { id:4, name:'Sandy AI Core',      lead:'Sandy Cheeks', status:'paused',   phase:'Planning',   progress:31, due:'2025-12-01', tags:['AI','machine learning'],        desc:'An AI agent trained on all lab data to assist with research decisions.' },
  { id:5, name:'Treedome 2.0',       lead:'Sandy Cheeks', status:'done',     phase:'Completed',  progress:100,due:'2025-05-01', tags:['habitat','engineering'],        desc:'Upgraded air dome with self-sustaining oxygen recycling system.' },
  { id:6, name:'Squirrel Soundwave', lead:'SpongeBob',    status:'archived', phase:'Archived',   progress:15, due:'2025-03-01', tags:['acoustics','experimental'],     desc:'Sonar-based communication device for surface-to-ocean messaging.' },
]

const STATUS_MAP = { active:'info', paused:'warning', done:'success', archived:'danger' }

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch]  = useState('')

  const filtered = PROJECTS.filter(p =>
    (filter === 'all' || p.status === filter) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-enter p-6 max-w-7xl mx-auto">
      <PageHeader
        icon="🔬"
        title="Projects"
        subtitle="Manage all lab research projects"
        actions={
          <button className="btn-glow text-white font-bold px-5 py-2.5 rounded-2xl text-sm">
            + New Project
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search projects…"
          className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-blue-400 text-sm outline-none focus:border-cyan-400 flex-1 min-w-[200px]"
        />
        {['all','active','paused','done','archived'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-2xl text-sm font-semibold capitalize transition-all ${
              filter === f ? 'btn-glow text-white' : 'bg-white/10 text-blue-300 hover:bg-white/15'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((p, i) => (
          <div
            key={p.id}
            className="glass-card p-5 flex flex-col gap-3 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            style={{ animationDelay: `${i*0.05}s` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-white text-base leading-tight">{p.name}</h3>
              <Badge label={p.status} variant={STATUS_MAP[p.status]} />
            </div>

            <p className="text-xs text-blue-300 leading-relaxed">{p.desc}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {p.tags.map(t => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-blue-300">#{t}</span>
              ))}
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-blue-400">{p.phase}</span>
                <span className="font-bold text-cyan-400">{p.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${p.progress}%`,
                    background: p.progress === 100 ? 'linear-gradient(90deg,#4caf50,#81c784)' : 'linear-gradient(90deg,#00bcd4,#26c6da)'
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-cyan-500/30 flex items-center justify-center text-xs">🦦</div>
                <span className="text-xs text-blue-300">{p.lead}</span>
              </div>
              <span className="text-xs text-blue-400">Due {p.due}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
