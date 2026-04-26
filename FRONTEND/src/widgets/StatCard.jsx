// Reusable stat card with glass morphism style
export default function StatCard({ icon, label, value, sub, color = '#00bcd4', trend }) {
  return (
    <div
      className="glass-card p-5 flex flex-col gap-2 animate-[slideUp_0.4s_ease-out_forwards]"
      style={{ animationFillMode: 'both' }}
    >
      <div className="flex items-center justify-between">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
          style={{ background: `${color}22`, border: `1px solid ${color}44` }}
        >
          {icon}
        </div>
        {trend !== undefined && (
          <span
            className="text-xs font-bold px-2 py-1 rounded-full"
            style={{
              background: trend >= 0 ? 'rgba(76,175,80,0.2)' : 'rgba(244,67,54,0.2)',
              color: trend >= 0 ? '#4caf50' : '#f44336',
            }}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-bubble" style={{ color, fontFamily: 'Fredoka One, cursive' }}>
          {value}
        </div>
        <div className="text-sm font-semibold text-blue-200">{label}</div>
        {sub && <div className="text-xs text-blue-400 mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}
