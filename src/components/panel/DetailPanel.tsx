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
  academic: '教学楼',
  residential: '学生宿舍',
  facility: '校园设施',
  administrative: '行政楼',
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

  // 把字段分组：快速信息（name, height, category）和详细信息（其余）
  const quickFields = fields.filter(f => ['name_zh', 'name_en', 'height', 'category'].includes(f.key))
  const detailFields = fields.filter(f => !['name_zh', 'name_en', 'height', 'category'].includes(f.key))

  return (
    <div className="detail-panel">
      {/* Header */}
      <div className="panel-header">
        <div className="panel-header-content">
          <div className="panel-header-top">
            {properties.category && (
              <span className={`panel-category panel-category--${properties.category}`}>
                {CATEGORY_LABELS[properties.category] || properties.category}
              </span>
            )}
            <button className="panel-close" onClick={onClose}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h2 className="panel-name">{properties.name_zh || properties.name_en || properties.id}</h2>
          {properties.name_en && properties.name_zh && (
            <span className="panel-name-en">{properties.name_en}</span>
          )}
        </div>
      </div>

      <div className="panel-body">
        {/* Quick stats row */}
        <div className="panel-stats">
          {quickFields
            .filter(f => f.key !== 'name_zh' && f.key !== 'name_en' && f.key !== 'category')
            .map(field => (
              <div key={field.key} className="panel-stat">
                <div className="panel-stat-value">
                  {typeof field.value === 'number' ? field.value : String(field.value)}
                  {field.unit && <span className="panel-stat-unit">{field.unit}</span>}
                </div>
                <div className="panel-stat-label">{field.label}</div>
              </div>
            ))}
        </div>

        {/* Detail fields */}
        {detailFields.length > 0 && (
          <div className="panel-section">
            {detailFields.map(field => (
              <div key={field.key} className="panel-field">
                <div className="panel-field-label">{field.label}</div>
                <div className="panel-field-value">
                  {renderValue(field.key, field.value, field.unit)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floor list */}
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
