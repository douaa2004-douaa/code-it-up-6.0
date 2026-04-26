import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page-enter flex flex-col items-center justify-center min-h-[80vh] gap-6 text-center px-6">
      <div
        className="bubble-deco flex items-center justify-center"
        style={{ width: 130, height: 130, fontSize: 64, animation: 'bubbleFloat 4s ease-in-out infinite' }}
      >
        🫧
      </div>
      <div>
        <h1 style={{ fontFamily:'Fredoka One,cursive', fontSize:'4rem', color:'#00bcd4', lineHeight:1 }}>
          404
        </h1>
        <p style={{ fontFamily:'Fredoka One,cursive', fontSize:'1.5rem', color:'#e3ae33' }}>
          Page Drifted Away!
        </p>
        <p className="text-blue-300 text-sm mt-2 max-w-xs">
          Looks like this page floated off to the surface. Sandy's looking for it!
        </p>
      </div>
      <Link
        to="/"
        className="btn-glow text-white font-bold px-8 py-3 rounded-2xl"
        style={{ fontFamily:'Fredoka One,cursive', fontSize:'1rem' }}
      >
        🏠 Back to Lab
      </Link>
      <style>{`
        @keyframes bubbleFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-16px) scale(1.06); }
        }
      `}</style>
    </div>
  )
}
