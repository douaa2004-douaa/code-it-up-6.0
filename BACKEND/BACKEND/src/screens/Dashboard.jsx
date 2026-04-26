import StatCard from '../widgets/StatCard'
import PageHeader from '../widgets/PageHeader'
import Badge from '../widgets/Badge'
import bgVideo from '../assets/vdbg.mp4'

const RECENT_ACTIVITY = [
  { id:1, icon:'🧪', msg:'Experiment #42 completed — Kelp extract synthesis',   time:'2m ago',  status:'success' },
  { id:2, icon:'📦', msg:'Low stock alert — Sodium chloride (NaCl)',              time:'14m ago', status:'warning' },
  { id:3, icon:'🤖', msg:'AI Agent "Sandy-GPT" started new analysis session',    time:'1h ago',  status:'info'    },
  { id:4, icon:'🔬', msg:'Project "Bubble Drive" milestone reached',              time:'3h ago',  status:'success' },
  { id:5, icon:'⚠️', msg:'Pressure sensor #7 reading anomalous values',          time:'5h ago',  status:'danger'  },
]

const PROJECTS_SUMMARY = [
  { name:'Bubble Drive',      progress:72, color:'#00bcd4' },
  { name:'Acorn Fuel Cell',   progress:45, color:'#e3ae33' },
  { name:'Kelp Bioreactor',   progress:88, color:'#4caf50' },
  { name:'Sandy AI Core',     progress:31, color:'#9c27b0' },
]

export default function Dashboard() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* 🎥 Background Video — fixed, covers full viewport incl. header */}
      <video
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          zIndex: -1,
        }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* 🌑 Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* 📊 Content */}
      <div className="relative z-10 page-enter px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">

        <PageHeader
          icon="🏠"
          title="Sandy's Lab Dashboard"
          subtitle="Welcome back, partner! Here's what's happening in the lab."
          actions={
            <button className="btn-glow text-white font-bold px-4 sm:px-5 py-2 text-xs sm:text-sm rounded-2xl">
              + New Experiment
            </button>
          }
        />

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon="🔬" label="Active Projects"   value="12"    sub="3 due this week"  color="#00bcd4" trend={8}  />
          <StatCard icon="🧪" label="Experiments Run"   value="284"   sub="This month"       color="#e3ae33" trend={12} />
          <StatCard icon="📦" label="Inventory Items"   value="1,842" sub="94 low stock"     color="#4caf50" trend={-3} />
          <StatCard icon="🤖" label="AI Queries Today"  value="67"    sub="Avg 2.4s response" color="#9c27b0" trend={25} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Recent Activity */}
          <div className="lg:col-span-2 glass-card p-6">
            <h2 className="text-base sm:text-lg font-bubble mb-4" style={{ fontFamily:'Fredoka One,cursive', color:'#00bcd4' }}>
              🌊 Recent Activity
            </h2>

            <div className="space-y-3">
              {RECENT_ACTIVITY.map(a => (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/70 hover:bg-white transition">
                  
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-white flex-shrink-0">
                    {a.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium leading-snug">{a.msg}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{a.time}</p>
                  </div>

                  <Badge 
                    label={a.status} 
                    variant={
                      a.status === 'danger' ? 'danger' :
                      a.status === 'warning' ? 'warning' :
                      a.status === 'success' ? 'success' : 'info'
                    } 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Project progress */}
          <div className="glass-card p-6">
            <h2 className="text-base sm:text-lg font-bubble mb-4" style={{ fontFamily:'Fredoka One,cursive', color:'#e3ae33' }}>
              🔬 Project Progress
            </h2>

            <div className="space-y-5">
              {PROJECTS_SUMMARY.map(p => (
                <div key={p.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-gray-800">{p.name}</span>
                    <span className="font-bold" style={{ color: p.color }}>{p.progress}%</span>
                  </div>

                  <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${p.progress}%`,
                        background: `linear-gradient(90deg, ${p.color}99, ${p.color})`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Sandy tip */}
            <div className="mt-6 p-3 rounded-2xl bg-white/90 border border-white/40">
              <p className="text-xs text-yellow-700">
                🤠 <strong>Sandy says:</strong> "Y'all keep up the good work! Science waits for no squirrel!"
              </p>
            </div>
          </div>
        </div>

        {/* Lab status bar */}
        <div className="glass-card mt-6 p-4 flex flex-wrap gap-6">
          {[
            { label:'Reactor Temp', val:'23.4°C', ok:true },
            { label:'Pressure', val:'1.02 atm', ok:true },
            { label:'O₂ Level', val:'20.8%', ok:true },
            { label:'Power', val:'94.2 kW', ok:true },
            { label:'Sensor Array', val:'7 ERRORS', ok:false },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${s.ok ? 'status-online' : 'status-offline'}`} />
              <span className="text-xs text-gray-600">{s.label}:</span>
              <span className={`text-xs font-bold ${s.ok ? 'text-gray-900' : 'text-red-500'}`}>
                {s.val}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}