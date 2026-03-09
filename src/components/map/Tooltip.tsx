import { getDisplayFields } from '../../config/fieldConfig'
import type { BuildingProperties, FloorProperties } from '../../types'
import './Tooltip.css'

interface TooltipProps {
  x: number
  y: number
  properties: BuildingProperties | FloorProperties
  isFloor?: boolean
}

export default function Tooltip({ x, y, properties, isFloor }: TooltipProps) {
  if (isFloor) {
    const fp = properties as FloorProperties
    return (
      <div className="tooltip" style={{ left: x + 12, top: y + 12 }}>
        <div className="tooltip-row">
          <span className="tooltip-label">楼层:</span>
          <span className="tooltip-value">{fp.floor_name}</span>
        </div>
        {fp.departments?.length > 0 && (
          <div className="tooltip-row">
            <span className="tooltip-label">部门:</span>
            <span className="tooltip-value">{fp.departments.join(', ')}</span>
          </div>
        )}
      </div>
    )
  }

  const fields = getDisplayFields(properties).filter(f => f.showInTooltip)

  return (
    <div className="tooltip" style={{ left: x + 12, top: y + 12 }}>
      {fields.map(field => (
        <div key={field.key} className="tooltip-row">
          <span className="tooltip-label">{field.label}:</span>
          <span className="tooltip-value">
            {String(field.value)}{field.unit ? ` ${field.unit}` : ''}
          </span>
        </div>
      ))}
    </div>
  )
}
