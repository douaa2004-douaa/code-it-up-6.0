import { useLocation } from 'react-router-dom'
import { useToast } from './Toast'
import logo from '../assets/s1.png'

const TITLES = {
  '/':            { label:'Dashboard',    icon:'🏠' },
  '/projects':    { label:'Projects',     icon:'🔬' },
  '/inventory':   { label:'Inventory',    icon:'🧪' },
  '/experiments': { label:'Experiments',  icon:'📋' },
  '/ai-chat':     { label:'AI Chat',      icon:'🤖' },
  '/admin':       { label:'Admin Panel',  icon:'⚙️' },
}

export default function TopBar() {
  const location = useLocation()
  const toast    = useToast()
  const info     = TITLES[location.pathname] || { label:'Sandy Lab', icon: '🔬' }
  const now      = new Date().toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })

  return (
    <div
      className="flex items-center justify-between px-6 py-3 border-b"
      style={{
        background: 'rgba(0,10,20,0.25)',
        backdropFilter: 'blur(12px)',
        borderColor: 'rgba(0,188,212,0.15)',
      }}
    >
      {/* Page title — mobile only */}
      <div className="flex items-center gap-2 md:hidden">
        <span className="text-xl">{info.icon}</span>
        <span className="font-bold text-white" style={{ fontFamily:'Fredoka One,cursive', color:'#00bcd4' }}>
          {info.label}
        </span>
      </div>

      {/* Date — desktop only */}
      <div className="hidden md:flex items-center gap-2 text-sm text-blue-400">
        <span>📅</span>
        <span>{now}</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={() => toast('Lab backup completed successfully!', 'success')}
          className="text-xs px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-blue-300 font-semibold transition"
        >
          💾 Backup
        </button>
        <button
          onClick={() => toast('Low stock alert: NaCl below minimum threshold', 'warning')}
          className="relative text-xl hover:scale-110 transition"
          title="Alerts"
        >
          🔔
          <span
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
            style={{ background:'#f44336', color:'white' }}
          >
            3
          </span>
        </button>

        {/* Avatar */}
        <div className="bubble-deco w-9 h-9 flex items-center justify-center text-lg cursor-pointer hover:scale-110 transition">
          <img src={logo} alt="Logo" />
        </div>
      </div>
    </div>
  )
}
