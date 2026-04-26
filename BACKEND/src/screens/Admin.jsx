import { useState, useEffect } from 'react'
import PageHeader from '../widgets/PageHeader'
import Badge from '../widgets/Badge'
import StatCard from '../widgets/StatCard'

const SYSTEM_LOGS = [
  { id:1,  level:'INFO',  msg:'Lab system initialized successfully',           time:'06:00:01', src:'core'     },
  { id:2,  level:'INFO',  msg:'All sensors online and reporting',               time:'06:00:05', src:'sensors'  },
  { id:3,  level:'WARN',  msg:'Sensor #7 pressure reading anomaly detected',   time:'08:42:13', src:'sensors'  },
  { id:4,  level:'INFO',  msg:'Sandy-GPT AI agent started session',             time:'09:15:00', src:'ai'       },
  { id:5,  level:'INFO',  msg:'Experiment EXP-039 initiated by AI Agent',       time:'09:15:02', src:'exp'      },
  { id:6,  level:'ERROR', msg:'NaCl stock below minimum threshold (12/20 kg)', time:'10:33:45', src:'inventory' },
  { id:7,  level:'INFO',  msg:'Backup snapshot completed — 2.4 GB',            time:'12:00:00', src:'backup'   },
  { id:8,  level:'WARN',  msg:'High CPU usage on AI training node: 94%',       time:'13:22:11', src:'ai'       },
  { id:9,  level:'INFO',  msg:'Kelp Bioreactor batch cycle 12 completed',      time:'14:05:33', src:'exp'      },
  { id:10, level:'ERROR', msg:'Acorn Extract stock EMPTY — order immediately', time:'15:48:20', src:'inventory' },
]

const SERVICES = [
  { name:'Lab API',          status:'online',  uptime:'99.9%', latency:'12ms'  },
  { name:'AI Engine',        status:'busy',    uptime:'98.4%', latency:'320ms' },
  { name:'Sensor Array',     status:'offline', uptime:'87.2%', latency:'—'     },
  { name:'Database',         status:'online',  uptime:'100%',  latency:'4ms'   },
  { name:'Backup Service',   status:'online',  uptime:'100%',  latency:'—'     },
  { name:'Sandy-GPT Worker', status:'online',  uptime:'99.1%', latency:'89ms'  },
]

const LOG_COLOR = { INFO:'info', WARN:'warning', ERROR:'danger' }
const STATUS_COLOR = { online:'success', offline:'danger', busy:'warning' }

export default function Admin() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="page-enter p-6 max-w-7xl mx-auto">
      <PageHeader
        icon="⚙️"
        title="Admin Panel"
        subtitle={`System control — Port 5050 simulated • ${time.toLocaleTimeString()}`}
      />

      {/* Admin warning */}
      <div className="mb-6 px-4 py-3 rounded-2xl flex items-center gap-3"
        style={{ background:'rgba(227,174,51,0.12)', border:'1px solid rgba(227,174,51,0.4)' }}>
        <span className="text-xl">🔐</span>
        <p className="text-sm" style={{ color:'#e3ae33' }}>
          <strong>Admin Access</strong> — Restricted to authorized lab personnel only. All actions are logged.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="⚡" label="CPU Usage"      value="71%"  sub="AI node: 94%"  color="#ff9800" />
        <StatCard icon="💾" label="Memory"         value="8.2GB" sub="of 16GB"      color="#00bcd4" />
        <StatCard icon="🌐" label="Network I/O"   value="42MB/s" sub="Downstream"   color="#4caf50" />
        <StatCard icon="💿" label="Storage"        value="1.8TB" sub="of 4TB used"  color="#9c27b0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Services */}
        <div className="glass-card p-6">
          <h2 className="font-bubble text-lg mb-4" style={{ fontFamily:'Fredoka One,cursive', color:'#00bcd4' }}>
            🛰 System Services
          </h2>
          <div className="space-y-3">
            {SERVICES.map(s => (
              <div key={s.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full status-${s.status}`} />
                  <span className="font-semibold text-sm text-white">{s.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-blue-400">
                  <span>Uptime: <strong className="text-green-400">{s.uptime}</strong></span>
                  <span>Latency: <strong className="text-cyan-400">{s.latency}</strong></span>
                  <Badge label={s.status} variant={STATUS_COLOR[s.status]} />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-5 flex-wrap">
            <button className="btn-glow text-white font-bold px-4 py-2 rounded-xl text-sm">🔄 Restart All</button>
            <button className="bg-white/10 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-white/15 transition">📊 Full Report</button>
            <button className="bg-white/10 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-white/15 transition">🧹 Clear Cache</button>
          </div>
        </div>

        {/* Mock analytics */}
        <div className="glass-card p-6">
          <h2 className="font-bubble text-lg mb-4" style={{ fontFamily:'Fredoka One,cursive', color:'#e3ae33' }}>
            📈 Analytics (Today)
          </h2>
          <div className="space-y-4">
            {[
              { label:'API Requests',   val:4821,  max:10000, color:'#00bcd4' },
              { label:'AI Queries',     val:67,    max:200,   color:'#9c27b0' },
              { label:'Data Written',   val:1240,  max:5000,  color:'#4caf50' },
              { label:'Active Sessions',val:8,     max:20,    color:'#e3ae33' },
            ].map(a => (
              <div key={a.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-blue-300 font-semibold">{a.label}</span>
                  <span className="font-bold" style={{ color:a.color }}>{a.val.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width:`${(a.val/a.max*100).toFixed(0)}%`, background:`linear-gradient(90deg,${a.color}88,${a.color})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System logs */}
      <div className="glass-card mt-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bubble text-lg" style={{ fontFamily:'Fredoka One,cursive', color:'#00bcd4' }}>
            📜 System Logs
          </h2>
          <button className="text-xs text-red-400 font-bold hover:text-red-300 transition">🗑 Clear Logs</button>
        </div>
        <div className="space-y-1 font-mono text-xs max-h-64 overflow-y-auto">
          {[...SYSTEM_LOGS].reverse().map(log => (
            <div key={log.id} className="flex gap-3 p-2 rounded-lg hover:bg-white/5">
              <span className="text-blue-500 flex-shrink-0">{log.time}</span>
              <Badge label={log.level} variant={LOG_COLOR[log.level]} />
              <span className="text-blue-400 flex-shrink-0">[{log.src}]</span>
              <span className={log.level === 'ERROR' ? 'text-red-300' : log.level === 'WARN' ? 'text-orange-300' : 'text-blue-200'}>
                {log.msg}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
