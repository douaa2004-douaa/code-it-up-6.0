const COLORS = {
  success: { bg: 'rgba(76,175,80,0.2)',  text: '#4caf50', border: 'rgba(76,175,80,0.4)'  },
  warning: { bg: 'rgba(255,152,0,0.2)',  text: '#ff9800', border: 'rgba(255,152,0,0.4)'  },
  danger:  { bg: 'rgba(244,67,54,0.2)',  text: '#f44336', border: 'rgba(244,67,54,0.4)'  },
  info:    { bg: 'rgba(0,188,212,0.2)',  text: '#00bcd4', border: 'rgba(0,188,212,0.4)'  },
  sand:    { bg: 'rgba(227,174,51,0.2)', text: '#e3ae33', border: 'rgba(227,174,51,0.4)' },
}

export default function Badge({ label, variant = 'info' }) {
  const c = COLORS[variant] || COLORS.info
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded-full"
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {label}
    </span>
  )
}
