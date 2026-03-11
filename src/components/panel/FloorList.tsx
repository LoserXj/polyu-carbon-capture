import { useState } from 'react'
import type { FloorProperties } from '../../types'
import type { Feature, Polygon } from 'geojson'

interface FloorListProps {
  floors: Feature<Polygon, FloorProperties>[]
  highlightedFloor: number | null
  onFloorSelect: (floor: number | null) => void
  onUpdateFloor?: (buildingId: string, floor: number, updates: Partial<FloorProperties>) => void
}

function FloorEditForm({
  properties,
  onSave,
  onCancel,
}: {
  properties: FloorProperties
  onSave: (updates: Partial<FloorProperties>) => void
  onCancel: () => void
}) {
  const [floorName, setFloorName] = useState(properties.floor_name || '')
  const [departments, setDepartments] = useState(
    Array.isArray(properties.departments) ? properties.departments.join(', ') : ''
  )
  const [description, setDescription] = useState(properties.description || '')

  const handleSave = () => {
    onSave({
      floor_name: floorName,
      departments: departments.split(',').map(s => s.trim()).filter(Boolean),
      description,
    })
  }

  return (
    <div className="floor-edit-form">
      <div className="edit-field">
        <label className="edit-label">楼层名称</label>
        <input
          className="edit-input"
          value={floorName}
          onChange={e => setFloorName(e.target.value)}
          placeholder="如 G/F, 1/F"
        />
      </div>
      <div className="edit-field">
        <label className="edit-label">部门（逗号分隔）</label>
        <input
          className="edit-input"
          value={departments}
          onChange={e => setDepartments(e.target.value)}
          placeholder="部门A, 部门B"
        />
      </div>
      <div className="edit-field">
        <label className="edit-label">描述</label>
        <textarea
          className="edit-input edit-textarea"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="楼层描述"
          rows={2}
        />
      </div>
      <div className="edit-actions">
        <button className="edit-btn edit-btn--save" onClick={handleSave}>保存</button>
        <button className="edit-btn edit-btn--cancel" onClick={onCancel}>取消</button>
      </div>
    </div>
  )
}

export default function FloorList({ floors, highlightedFloor, onFloorSelect, onUpdateFloor }: FloorListProps) {
  const [editingFloor, setEditingFloor] = useState<number | null>(null)

  return (
    <div className="panel-floors">
      <div className="panel-divider" />
      <div className="panel-field-label">楼层</div>
      <div className="panel-floors-hint">点击楼层高亮，双击编辑</div>
      <div className="floor-list">
        {floors
          .slice()
          .sort((a, b) => b.properties.floor - a.properties.floor)
          .map(f => {
            const fp = f.properties
            const isActive = highlightedFloor === fp.floor
            const isEditing = editingFloor === fp.floor

            if (isEditing) {
              return (
                <div key={fp.floor} className="floor-item floor-item--editing">
                  <FloorEditForm
                    properties={fp}
                    onSave={(updates) => {
                      onUpdateFloor?.(fp.building_id, fp.floor, updates)
                      setEditingFloor(null)
                    }}
                    onCancel={() => setEditingFloor(null)}
                  />
                </div>
              )
            }

            return (
              <button
                key={fp.floor}
                className={`floor-item ${isActive ? 'floor-item--active' : ''}`}
                onClick={() => onFloorSelect(isActive ? null : fp.floor)}
                onDoubleClick={(e) => {
                  e.stopPropagation()
                  if (onUpdateFloor) setEditingFloor(fp.floor)
                }}
              >
                <span className="floor-name">{fp.floor_name}</span>
                <span className="floor-dept">
                  {fp.departments?.join(', ') || '—'}
                </span>
                {onUpdateFloor && (
                  <span
                    className="floor-edit-icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingFloor(fp.floor)
                    }}
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </span>
                )}
              </button>
            )
          })}
      </div>
    </div>
  )
}
