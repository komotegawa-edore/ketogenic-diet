type MacroProgressProps = {
  label: string
  current: number
  goal: number
  unit: string
  color: 'green' | 'yellow' | 'red' | 'blue'
  showWarning?: boolean
}

const colorClasses = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
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
        <span className="text-sm font-medium text-gray-700">
          {label}
          {showWarning && isOver && (
            <span className="ml-2 text-red-500 text-xs">オーバー!</span>
          )}
        </span>
        <span className={`text-sm ${isOver && showWarning ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
          {current.toFixed(1)} / {goal}{unit}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isOver && showWarning ? 'bg-red-500' : colorClasses[color]
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
