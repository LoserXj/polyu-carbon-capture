import { useState } from 'react'
import { getDisplayFields } from '../../config/fieldConfig'
import FloorList from './FloorList'
import EnergyCharts from './EnergyCharts'
import type { BuildingProperties, FloorProperties } from '../../types'
import type { Feature, Polygon } from 'geojson'
import './DetailPanel.css'

interface DetailPanelProps {
  properties: BuildingProperties
  floors?: Feature<Polygon, FloorProperties>[]
  highlightedFloor: number | null
  onFloorSelect: (floor: number | null) => void
  onClose: () => void
  onUpdate?: (id: string, updates: Partial<BuildingProperties>) => void
  onUpdateFloor?: (buildingId: string, floor: number, updates: Partial<FloorProperties>) => void
  closing?: boolean
}

const CATEGORY_LABELS: Record<string, string> = {
  academic: '教学楼',
  residential: '学生宿舍',
  facility: '校园设施',
  administrative: '行政楼',
}

const CATEGORY_OPTIONS = ['academic', 'residential', 'facility', 'administrative']

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

interface EditFormState {
  name_zh: string
  name_en: string
  category: string
  departments: string
  description: string
}

function EditForm({
  properties,
  onSave,
  onCancel,
}: {
  properties: BuildingProperties
  onSave: (updates: Partial<BuildingProperties>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<EditFormState>({
    name_zh: properties.name_zh || '',
    name_en: properties.name_en || '',
    category: properties.category || 'facility',
    departments: Array.isArray(properties.departments) ? properties.departments.join(', ') : '',
    description: properties.description || '',
  })

  const handleSave = () => {
    onSave({
      name_zh: form.name_zh,
      name_en: form.name_en,
      category: form.category,
      departments: form.departments.split(',').map(s => s.trim()).filter(Boolean),
      description: form.description,
    })
  }

  return (
    <div className="edit-form">
      <div className="edit-field">
        <label className="edit-label">中文名称</label>
        <input
          className="edit-input"
          value={form.name_zh}
          onChange={e => setForm(f => ({ ...f, name_zh: e.target.value }))}
          placeholder="输入中文名称"
        />
      </div>
      <div className="edit-field">
        <label className="edit-label">English Name</label>
        <input
          className="edit-input"
          value={form.name_en}
          onChange={e => setForm(f => ({ ...f, name_en: e.target.value }))}
          placeholder="Enter English name"
        />
      </div>
      <div className="edit-field">
        <label className="edit-label">类别</label>
        <select
          className="edit-input edit-select"
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
        >
          {CATEGORY_OPTIONS.map(c => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>
      </div>
      <div className="edit-field">
        <label className="edit-label">部门（逗号分隔）</label>
        <input
          className="edit-input"
          value={form.departments}
          onChange={e => setForm(f => ({ ...f, departments: e.target.value }))}
          placeholder="部门A, 部门B"
        />
      </div>
      <div className="edit-field">
        <label className="edit-label">简介</label>
        <textarea
          className="edit-input edit-textarea"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          placeholder="建筑简介"
          rows={3}
        />
      </div>
      <div className="edit-actions">
        <button className="edit-btn edit-btn--save" onClick={handleSave}>保存</button>
        <button className="edit-btn edit-btn--cancel" onClick={onCancel}>取消</button>
      </div>
    </div>
  )
}

export default function DetailPanel({
  properties,
  floors,
  highlightedFloor,
  onFloorSelect,
  onClose,
  onUpdate,
  onUpdateFloor,
  closing,
}: DetailPanelProps) {
  const [editing, setEditing] = useState(false)
  const fields = getDisplayFields(properties)

  const quickKeys = new Set(['name_zh', 'name_en', 'height', 'category'])
  const quickFields = fields.filter(f => quickKeys.has(f.key))
  const detailFields = fields.filter(f => !quickKeys.has(f.key))

  const handleSave = (updates: Partial<BuildingProperties>) => {
    onUpdate?.(properties.id, updates)
    setEditing(false)
  }

  return (
    <div className={`detail-panel ${closing ? 'detail-panel--closing' : ''}`}>
      {/* Header */}
      <div className="panel-header">
        <div className="panel-header-content">
          <div className="panel-header-top">
            {properties.category && (
              <span className={`panel-category panel-category--${properties.category}`}>
                {CATEGORY_LABELS[properties.category] || properties.category}
              </span>
            )}
            <div className="panel-header-actions">
              {onUpdate && !editing && (
                <button className="panel-edit-btn" onClick={() => setEditing(true)} title="编辑">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              )}
              <button className="panel-close" onClick={onClose}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <h2 className="panel-name">{properties.name_zh || properties.name_en || properties.id}</h2>
          {properties.name_en && properties.name_zh && (
            <span className="panel-name-en">{properties.name_en}</span>
          )}
          <span className="panel-id">ID: {properties.id}</span>
        </div>
      </div>

      <div className="panel-body">
        {editing ? (
          <EditForm
            properties={properties}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
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

            {/* Energy Charts */}
            {properties.annual_energy != null && (
              <EnergyCharts
                annualEnergy={properties.annual_energy}
                annualCarbon={properties.annual_carbon}
                carbonCapture={properties.carbon_capture}
                buildingArea={properties.building_area}
              />
            )}

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
                onUpdateFloor={onUpdateFloor}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
