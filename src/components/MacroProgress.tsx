type MacroProgressProps = {
  label: string
  current: number
  goal: number
  unit: string
  color: 'teal' | 'yellow' | 'red' | 'blue'
  showWarning?: boolean
}

const colorClasses = {
  teal: 'bg-[#5DDFC3]',
  yellow: 'bg-amber-400',
  red: 'bg-rose-400',
  blue: 'bg-sky-400',
}

export default function MacroProgress({
  label,
  current,
  goal,
  unit,
  color,
  showWarning = false,
}: MacroProgressProps) {
  const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0
  const isOver = current > goal

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium" style={{ color: '#3A405A' }}>
          {label}
          {showWarning && isOver && (
            <span className="ml-2 text-rose-500 text-xs">オーバー!</span>
          )}
        </span>
        <span className={`text-sm ${isOver && showWarning ? 'text-rose-500 font-bold' : 'text-gray-600'}`}>
          {current.toFixed(1)} / {goal}{unit}
        </span>
      </div>
      <div className="w-full rounded-full h-3 overflow-hidden" style={{ backgroundColor: '#E5E7EB' }}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isOver && showWarning ? 'bg-rose-500' : colorClasses[color]
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
