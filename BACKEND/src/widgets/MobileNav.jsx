import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { path: '/',            icon: '🏠', label: 'Home'    },
  { path: '/projects',    icon: '🔬', label: 'Projects' },
  { path: '/inventory',   icon: '🧪', label: 'Stock'   },
  { path: '/experiments', icon: '📋', label: 'Logs'    },
  { path: '/ai-chat',     icon: '🤖', label: 'AI'      },
  { path: '/admin',       icon: '⚙️',  label: 'Admin'  },
]

export default function MobileNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden flex"
      style={{
        background: 'rgba(0,30,50,0.92)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,188,212,0.25)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {NAV_ITEMS.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-bold transition-all ${
              isActive ? 'text-cyan-400' : 'text-blue-400'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className="text-xl transition-transform"
                style={{ transform: isActive ? 'scale(1.2)' : 'scale(1)' }}
              >
                {item.icon}
              </span>
              <span className="text-[10px]">{item.label}</span>
              {isActive && (
                <div
                  className="w-1 h-1 rounded-full"
                  style={{ background: '#00bcd4', boxShadow: '0 0 6px #00bcd4' }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
