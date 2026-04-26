import { useEffect, useState } from 'react'
import logo from '../assets/s1.png'
const TIPS = [
  'Calibrating bubble pressure sensors…',
  'Syncing kelp bioreactor data…',
  'Loading Sandy-GPT neural weights…',
  'Pressurizing Treedome systems…',
  'Fetching acorn fuel cell readings…',
]

export default function SplashScreen({ onDone }) {
  const [tip, setTip]           = useState(0)
  const [progress, setProgress] = useState(0)
  const [fading, setFading]     = useState(false)

  useEffect(() => {
    const tipInterval = setInterval(() => setTip(t => (t + 1) % TIPS.length), 900)
    const progInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(progInterval)
          clearInterval(tipInterval)
          setFading(true)
          setTimeout(onDone, 600)
          return 100
        }
        return p + 2
      })
    }, 60)
    return () => { clearInterval(tipInterval); clearInterval(progInterval) }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #001220 0%, #003d5b 50%, #005f73 100%)',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
    >
      {/* Ambient bubbles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="bg-bubble"
          style={{
            width:  20 + (i * 13) % 60,
            height: 20 + (i * 13) % 60,
            left:   `${(i * 8.3) % 100}%`,
            bottom: '-10%',
            animationDuration: `${7 + (i % 5)}s`,
            animationDelay:    `${(i * 0.7) % 4}s`,
          }}
        />
      ))}

      {/* Logo */}
      <div
        className="bubble-deco flex items-center justify-center mb-6"
        style={{
          width: 120, height: 120,
          fontSize: 56,
          animation: 'bubbleFloat 3s ease-in-out infinite',
        }}
      >
        <img src={logo} alt="Logo" />
      </div>

      <h1
        style={{
          fontFamily: 'Fredoka One, cursive',
          fontSize: '2.8rem',
          color: '#00bcd4',
          textShadow: '0 0 40px rgba(0,188,212,0.6)',
          lineHeight: 1,
        }}
      >
        Sandy's Lab
      </h1>
      <p style={{ color: '#e3ae33', fontFamily: 'Fredoka One, cursive', fontSize: '1.1rem', marginTop: 4 }}>
        Management System
      </p>

      {/* Progress bar */}
      <div
        className="mt-10 rounded-full overflow-hidden"
        style={{ width: 280, height: 6, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(0,188,212,0.3)' }}
      >
        <div
          className="h-full rounded-full transition-all duration-100"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #006994, #00bcd4, #e3ae33)',
            boxShadow: '0 0 12px rgba(0,188,212,0.8)',
          }}
        />
      </div>

      {/* Tip text */}
      <p
        className="mt-4 text-sm font-semibold"
        style={{ color: 'rgba(176,224,230,0.7)', minHeight: 20, transition: 'opacity 0.3s' }}
      >
        {TIPS[tip]}
      </p>

      <p className="absolute bottom-8 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
        Powered by Sandy Cheeks Science™
      </p>

      <style>{`
        @keyframes bubbleFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-14px) scale(1.05); }
        }
      `}</style>
    </div>
  )
}
