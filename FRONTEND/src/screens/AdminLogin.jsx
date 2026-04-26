import { useState } from 'react'
import bgVideo from '../assets/vdbg.mp4'

const CORRECT_USER = 'sandy'
const CORRECT_PASS = 'sandy123'

export default function AdminLogin({ onSuccess }) {
  const [user, setUser]   = useState('')
  const [pass, setPass]   = useState('')
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [showPass, setShowPass] = useState(false)

  function handleSubmit() {
    if (user === CORRECT_USER && pass === CORRECT_PASS) {
      setError('')
      onSuccess()
    } else {
      setError('Invalid credentials. Access denied.')
      setShake(true)
      setTimeout(() => setShake(false), 600)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background video */}
      <video
        autoPlay muted loop playsInline
        style={{ position:'fixed', inset:0, width:'100%', height:'100%', objectFit:'cover', zIndex:-1 }}
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div style={{ position:'fixed', inset:0, background:'rgba(0,10,25,0.65)', zIndex:0 }} />

      {/* Floating bubbles */}
      <div style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none', overflow:'hidden' }}>
        {Array.from({length:12}).map((_, i) => (
          <div
            key={i}
            className="bubble-deco"
            style={{
              position: 'absolute',
              width:  20 + (i*13)%50,
              height: 20 + (i*13)%50,
              left:   `${(i*8.3)%100}%`,
              bottom: '-60px',
              animation: `bubbleFloat ${4 + (i%4)}s ease-in-out ${i*0.4}s infinite`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      {/* Login card */}
      <div
        className={`glass-card relative z-10 flex flex-col items-center gap-6 ${shake ? 'shake' : ''}`}
        style={{
          width: '100%',
          maxWidth: 420,
          margin: '0 16px',
          padding: '48px 40px',
          borderRadius: 28,
          border: '1px solid rgba(0,188,212,0.3)',
          boxShadow: '0 0 60px rgba(0,188,212,0.12), 0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* Logo + title */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="bubble-deco flex items-center justify-center text-3xl"
            style={{ width: 68, height: 68, fontSize: 32 }}
          >
            ⚙️
          </div>
          <h1 style={{ fontFamily:'Fredoka One, cursive', color:'#00bcd4', fontSize:'1.8rem', lineHeight:1 }}>
            Admin Access
          </h1>
          <p style={{ color:'rgba(147,197,253,0.7)', fontSize:'0.82rem', textAlign:'center' }}>
            Sandy's Lab — Restricted Area
          </p>
        </div>

        {/* Divider */}
        <div style={{ width:'100%', height:1, background:'rgba(0,188,212,0.2)' }} />

        {/* Inputs */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-1.5">
            <label style={{ color:'#93c5fd', fontSize:'0.78rem', fontWeight:600, letterSpacing:'0.05em' }}>
              USERNAME
            </label>
            <input
              type="text"
              value={user}
              onChange={e => { setUser(e.target.value); setError('') }}
              onKeyDown={handleKey}
              placeholder="Enter username"
              autoComplete="username"
              style={{
                background: 'rgba(0,30,55,0.6)',
                border: `1px solid ${error ? 'rgba(244,67,54,0.6)' : 'rgba(0,188,212,0.25)'}`,
                borderRadius: 14,
                padding: '12px 16px',
                color: 'white',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                width: '100%',
                fontFamily: 'inherit',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(0,188,212,0.7)'}
              onBlur={e => e.target.style.borderColor = error ? 'rgba(244,67,54,0.6)' : 'rgba(0,188,212,0.25)'}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={{ color:'#93c5fd', fontSize:'0.78rem', fontWeight:600, letterSpacing:'0.05em' }}>
              PASSWORD
            </label>
            <div style={{ position:'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={e => { setPass(e.target.value); setError('') }}
                onKeyDown={handleKey}
                placeholder="Enter password"
                autoComplete="current-password"
                style={{
                  background: 'rgba(0,30,55,0.6)',
                  border: `1px solid ${error ? 'rgba(244,67,54,0.6)' : 'rgba(0,188,212,0.25)'}`,
                  borderRadius: 14,
                  padding: '12px 44px 12px 16px',
                  color: 'white',
                  fontSize: '0.95rem',
                  outline: 'none',
                  width: '100%',
                  fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,188,212,0.7)'}
                onBlur={e => e.target.style.borderColor = error ? 'rgba(244,67,54,0.6)' : 'rgba(0,188,212,0.25)'}
              />
              <button
                onClick={() => setShowPass(p => !p)}
                style={{
                  position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
                  background:'none', border:'none', cursor:'pointer', color:'rgba(147,197,253,0.6)',
                  fontSize: '1.1rem', padding: 0,
                }}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(244,67,54,0.12)',
              border: '1px solid rgba(244,67,54,0.35)',
              borderRadius: 10,
              padding: '10px 14px',
              color: '#ff8a80',
              fontSize: '0.83rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              🔒 {error}
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className="btn-glow w-full"
          style={{
            padding: '14px',
            borderRadius: 16,
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 700,
            color: 'white',
            fontFamily: 'inherit',
            letterSpacing: '0.03em',
          }}
        >
          🔓 Enter Lab
        </button>

        <p style={{ color:'rgba(100,150,180,0.5)', fontSize:'0.72rem', textAlign:'center' }}>
          Authorised personnel only · Sandy's Lab © 2025
        </p>
      </div>

      <style>{`
        @keyframes bubbleFloat {
          0%   { transform: translateY(0) scale(1); opacity: 0.4; }
          50%  { transform: translateY(-120px) scale(1.05); opacity: 0.25; }
          100% { transform: translateY(-240px) scale(0.9); opacity: 0; }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-10px); }
          40%      { transform: translateX(10px); }
          60%      { transform: translateX(-6px); }
          80%      { transform: translateX(6px); }
        }
        .shake { animation: shake 0.5s ease; }
        input::placeholder { color: rgba(147,197,253,0.3); }
      `}</style>
    </div>
  )
}
