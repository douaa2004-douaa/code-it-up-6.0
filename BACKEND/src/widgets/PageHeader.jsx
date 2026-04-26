// Reusable page header with title + optional actions
export default function PageHeader({ title, subtitle, icon, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        {icon && (
          <div
            className="bubble-deco w-14 h-14 flex items-center justify-center text-3xl"
            style={{ animation: 'bubbleFloat 6s ease-in-out infinite' }}
          >
            {icon}
          </div>
        )}
        <div>
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: 'Fredoka One, cursive', color: '#00bcd4', lineHeight: 1.1 }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-blue-300 text-sm mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex gap-2">{actions}</div>}
    </div>
  )
}
