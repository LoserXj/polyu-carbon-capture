import './EnergyCharts.css'

interface EnergyChartsProps {
  annualEnergy: number
  annualCarbon: number
  carbonCapture: number
  buildingArea: number
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toFixed(0)
}

export default function EnergyCharts({
  annualEnergy,
  annualCarbon,
  carbonCapture,
  buildingArea,
}: EnergyChartsProps) {
  const captureRate = annualCarbon > 0 ? (carbonCapture / annualCarbon) * 100 : 0
  const energyIntensity = buildingArea > 0 ? annualEnergy / buildingArea : 0
  const intensityMax = 250
  const intensityPct = Math.min((energyIntensity / intensityMax) * 100, 100)

  // Color code energy intensity
  let intensityColor = '#2e7d32' // green
  if (energyIntensity > 150) intensityColor = '#c62828' // red
  else if (energyIntensity > 100) intensityColor = '#ef6c00' // orange

  return (
    <div className="energy-charts">
      {/* Carbon Capture Rate */}
      <div className="chart-section">
        <div className="chart-header">
          <span className="chart-label">碳捕集率</span>
          <span className="chart-value">{captureRate.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill progress-fill--capture"
            style={{ width: `${Math.min(captureRate, 100)}%` }}
          />
        </div>
      </div>

      {/* Energy Intensity */}
      <div className="chart-section">
        <div className="chart-header">
          <span className="chart-label">能耗强度</span>
          <span className="chart-value">{energyIntensity.toFixed(0)} <span className="chart-unit">kWh/m²</span></span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${intensityPct}%`, background: intensityColor }}
          />
        </div>
      </div>

      {/* Carbon Emission vs Capture */}
      <div className="chart-section">
        <div className="chart-label">碳排放 vs 碳捕集</div>
        <div className="bar-chart">
          <div className="bar-row">
            <span className="bar-row-label">排放</span>
            <div className="bar-track">
              <div className="bar-fill bar-fill--carbon" style={{ width: '100%' }} />
            </div>
            <span className="bar-row-value">{formatNum(annualCarbon)} t</span>
          </div>
          <div className="bar-row">
            <span className="bar-row-label">捕集</span>
            <div className="bar-track">
              <div
                className="bar-fill bar-fill--capture"
                style={{ width: `${Math.min(captureRate, 100)}%` }}
              />
            </div>
            <span className="bar-row-value">{formatNum(carbonCapture)} t</span>
          </div>
        </div>
      </div>
    </div>
  )
}
