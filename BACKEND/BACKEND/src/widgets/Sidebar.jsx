import { NavLink } from 'react-router-dom'
import logo from '../assets/s1.png'

const NAV_ITEMS = [
  { path: '/',            icon: '🏠', label: 'Dashboard'   },
  { path: '/projects',    icon: '🔬', label: 'Projects'    },
  { path: '/inventory',   icon: '🧪', label: 'Inventory'   },
  { path: '/experiments', icon: '📋', label: 'Experiments' },
  { path: '/ai-chat',     icon: '🤖', label: 'AI Chat'     },
  { path: '/admin',       icon: '⚙️',  label: 'Admin'      },
]

export default function Sidebar() {
  return (
    <header
      className="hidden md:flex items-center w-full z-30"
      style={{
        background: 'rgba(0, 10, 20, 0.35)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,188,212,0.25)',
        height: '64px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 flex-shrink-0">
        <div
          className="bubble-deco flex items-center justify-center"
          style={{ width: 40, height: 40 }}
        >
          <img src={logo} alt="Logo" style={{ width: 28, height: 28, objectFit: 'contain' }} />
        </div>
        <div>
          <div style={{ fontFamily: 'Fredoka One, cursive', color: '#00bcd4', fontSize: '1.1rem', lineHeight: 1 }}>
            Sandy's
          </div>
          <div style={{ fontFamily: 'Fredoka One, cursive', color: '#e3ae33', fontSize: '0.75rem' }}>
            Lab
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 32, background: 'rgba(0,188,212,0.25)', margin: '0 8px', flexShrink: 0 }} />

      {/* Nav links */}
      <nav className="flex items-center gap-1 flex-1 px-2">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all duration-200 text-sm font-semibold whitespace-nowrap ${
                isActive
                  ? 'nav-active text-white'
                  : 'text-blue-200 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Right: status */}
      <div className="flex items-center gap-3 px-6 flex-shrink-0">
        <div className="flex items-center gap-2 text-xs text-blue-300">
          <span className="status-online w-2 h-2 rounded-full inline-block" />
          Lab Online
        </div>
      </div>
    </header>
  )
}
