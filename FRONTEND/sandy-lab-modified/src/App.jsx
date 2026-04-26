import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Sidebar          from './widgets/Sidebar'
import MobileNav        from './widgets/MobileNav'
import BubbleBackground from './widgets/BubbleBackground'
import SplashScreen     from './widgets/SplashScreen'
import TopBar           from './widgets/TopBar'
import { ToastProvider } from './widgets/Toast'
import { LabStoreProvider } from './services/useLabStore'

import Dashboard   from './screens/Dashboard'
import Projects    from './screens/Projects'
import Inventory   from './screens/Inventory'
import Experiments from './screens/Experiments'
import AIChat      from './screens/AIChat'
import Admin       from './screens/Admin'
import AdminLogin  from './screens/AdminLogin'
import NotFound    from './screens/NotFound'

function BubbleTransition({ show }) {
  if (!show) return null
  const bubbles = Array.from({ length: 22 }, (_, i) => ({
    size:  15 + (i * 17) % 75,
    left:  (i * 4.7) % 100,
    delay: (i * 0.055).toFixed(2),
    dur:   (0.55 + (i % 5) * 0.08).toFixed(2),
  }))
  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {bubbles.map((b, i) => (
        <div
          key={i}
          className="bubble-deco absolute"
          style={{
            width: b.size, height: b.size,
            left: `${b.left}%`,
            bottom: '-15%',
            animation: `floatUp ${b.dur}s ease-out ${b.delay}s forwards`,
          }}
        />
      ))}
    </div>
  )
}

function AppLayout() {
  const location = useLocation()
  const [transitioning, setTransitioning] = useState(false)
  const [prevPath, setPrevPath]           = useState(location.pathname)
  const [adminAuth, setAdminAuth]         = useState(false)

  useEffect(() => {
    if (location.pathname !== prevPath) {
      setTransitioning(true)
      const t = setTimeout(() => setTransitioning(false), 950)
      setPrevPath(location.pathname)
      return () => clearTimeout(t)
    }
  }, [location.pathname])

  return (
    <div className="flex flex-col min-h-screen relative">
      <BubbleBackground />
      <BubbleTransition show={transitioning} />

      {/* Horizontal top nav (desktop) */}
      <Sidebar />

      {/* TopBar (date + actions) shown below the nav on desktop, still used on mobile as the header */}
      <div
        className="flex flex-col flex-1 overflow-hidden relative z-10"
        style={{ paddingTop: '64px' }}
      >
        <TopBar />
        <main
          className="flex-1 overflow-auto"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 64px)' }}
        >
          <Routes>
            <Route path="/"            element={<Dashboard   />} />
            <Route path="/projects"    element={<Projects    />} />
            <Route path="/inventory"   element={<Inventory   />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/ai-chat"     element={<AIChat      />} />
            <Route path="/admin" element={
              adminAuth
                ? <Admin />
                : <AdminLogin onSuccess={() => setAdminAuth(true)} />
            } />
            <Route path="*"            element={<NotFound    />} />
          </Routes>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    <LabStoreProvider>
      <ToastProvider>
        {!ready && <SplashScreen onDone={() => setReady(true)} />}
        <div style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.5s ease' }}>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </div>
      </ToastProvider>
    </LabStoreProvider>
  )
}
