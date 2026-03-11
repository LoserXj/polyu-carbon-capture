import './StatsBar.css'

export interface CampusStats {
  totalBuildings: number
  totalArea: number
  totalEnergy: number
  totalCarbon: number
  totalCapture: number
}

interface StatsBarProps {
  stats: CampusStats
}

function formatNum(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toFixed(0)
}

function getUnit(n: number, base: string): string {
  if (n >= 1_000_000_000) return `G${base}`
  if (n >= 1_000_000) return `M${base}`
  if (n >= 1_000) return `K${base}`
  return base
}

export default function StatsBar({ stats }: StatsBarProps) {
  const captureRate = stats.totalCarbon > 0
    ? ((stats.totalCapture / stats.totalCarbon) * 100).toFixed(1)
    : '0'

  return (
    <div className="stats-bar">
      <div className="stats-item">
        <div className="stats-value">{stats.totalBuildings.toLocaleString()}</div>
        <div className="stats-label">建筑总数</div>
      </div>
      <div className="stats-item">
        <div className="stats-value">
          {formatNum(stats.totalArea)}
          <span className="stats-unit"> m²</span>
        </div>
        <div className="stats-label">总面积</div>
      </div>
      <div className="stats-item">
        <div className="stats-value">
          {formatNum(stats.totalEnergy)}
          <span className="stats-unit"> {getUnit(stats.totalEnergy, 'Wh')}</span>
        </div>
        <div className="stats-label">年能耗</div>
      </div>
      <div className="stats-item">
        <div className="stats-value">
          {formatNum(stats.totalCarbon)}
          <span className="stats-unit"> {getUnit(stats.totalCarbon, 'tCO₂')}</span>
        </div>
        <div className="stats-label">年碳排放</div>
      </div>
      <div className="stats-item">
        <div className="stats-value stats-value--capture">
          {captureRate}
          <span className="stats-unit">%</span>
        </div>
        <div className="stats-label">碳捕集率</div>
      </div>
    </div>
  )
}
