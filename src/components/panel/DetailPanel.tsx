import { getDisplayFields } from '../../config/fieldConfig'
import FloorList from './FloorList'
import type { BuildingProperties, FloorProperties } from '../../types'
import type { Feature, Polygon } from 'geojson'
import './DetailPanel.css'

interface DetailPanelProps {
  properties: BuildingProperties
  floors?: Feature<Polygon, FloorProperties>[]
  highlightedFloor: number | null
  onFloorSelect: (floor: number | null) => void
  onClose: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  academic: '教学',
  residential: '宿舍',
  facility: '设施',
  administrative: '行政',
}

function renderValue(key: string, value: unknown, unit?: string): React.ReactNode {
  if (key === 'category' && typeof value === 'string') {
    const label = CATEGORY_LABELS[value] || value
    return (
      <span className={`panel-category panel-category--${value}`}>
        {label}
      </span>
    )
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="panel-empty">—</span>
    return (
      <div className="panel-tags">
        {value.map((item, i) => (
          <span key={i} className="panel-tag">{String(item)}</span>
        ))}
      </div>
    )
  }
  if (typeof value === 'boolean') return value ? '是' : '否'
  if (typeof value === 'number') return `${value}${unit ? ` ${unit}` : ''}`
  if (typeof value === 'object' && value !== null) {
    return <pre className="panel-json">{JSON.stringify(value, null, 2)}</pre>
  }
  return `${String(value)}${unit ? ` ${unit}` : ''}`
}

export default function DetailPanel({
  properties,
  floors,
  highlightedFloor,
  onFloorSelect,
  onClose,
}: DetailPanelProps) {
  const fields = getDisplayFields(properties)

  return (
    <div className="detail-panel">
      <div className="panel-header">
        <div className="panel-title">
          <h2>{properties.name_zh || properties.name_en || properties.id}</h2>
          {properties.name_en && properties.name_zh && (
            <span className="panel-subtitle">{properties.name_en}</span>
          )}
        </div>
        <button className="panel-close" onClick={onClose}>✕</button>
      </div>

      <div className="panel-body">
        {fields.map((field, i) => (
          <div key={field.key}>
            <div className="panel-field">
              <div className="panel-field-label">{field.label}</div>
              <div className="panel-field-value">
                {renderValue(field.key, field.value, field.unit)}
              </div>
            </div>
            {field.key === 'category' && i < fields.length - 1 && (
              <div className="panel-divider" />
            )}
          </div>
        ))}

        {floors && floors.length > 0 && (
          <FloorList
            floors={floors}
            highlightedFloor={highlightedFloor}
            onFloorSelect={onFloorSelect}
          />
        )}
      </div>
    </div>
  )
}
