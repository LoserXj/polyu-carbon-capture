import type { FloorProperties } from '../../types'
import type { Feature, Polygon } from 'geojson'

interface FloorListProps {
  floors: Feature<Polygon, FloorProperties>[]
  highlightedFloor: number | null
  onFloorSelect: (floor: number | null) => void
}

export default function FloorList({ floors, highlightedFloor, onFloorSelect }: FloorListProps) {
  return (
    <div className="panel-floors">
      <div className="panel-divider" />
      <div className="panel-field-label">楼层</div>
      <div className="panel-floors-hint">点击楼层可在地图上高亮对应层</div>
      <div className="floor-list">
        {floors
          .slice()
          .sort((a, b) => b.properties.floor - a.properties.floor)
          .map(f => {
            const fp = f.properties
            const isActive = highlightedFloor === fp.floor
            return (
              <button
                key={fp.floor}
                className={`floor-item ${isActive ? 'floor-item--active' : ''}`}
                onClick={() => onFloorSelect(isActive ? null : fp.floor)}
              >
                <span className="floor-name">{fp.floor_name}</span>
                <span className="floor-dept">
                  {fp.departments?.join(', ') || '—'}
                </span>
              </button>
            )
          })}
      </div>
    </div>
  )
}
