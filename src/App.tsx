import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import './App.css'
import MapView from './components/map/MapView'
import TopBar from './components/layout/TopBar'
import SearchBar from './components/search/SearchBar'
import Loading from './components/layout/Loading'
import StatsBar from './components/layout/StatsBar'
import { useBuildings } from './hooks/useBuildings'
import { useFloors } from './hooks/useFloors'
import type { BuildingProperties } from './types'

export interface MapHandle {
  selectBuilding: (building: BuildingProperties) => void
}

function App() {
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const mapHandleRef = useRef<MapHandle | null>(null)
  const { data: buildingsData, list: buildingsList, updateBuilding, exportGeoJSON: exportBuildings, hasEdits: hasBuildingEdits, clearEdits: clearBuildingEdits } = useBuildings()
  const { exportGeoJSON: exportFloors, hasEdits: hasFloorEdits, clearEdits: clearFloorEdits } = useFloors(null)

  const hasEdits = hasBuildingEdits || hasFloorEdits

  const campusStats = useMemo(() => {
    if (!buildingsList.length) return null
    return {
      totalBuildings: buildingsList.length,
      totalArea: buildingsList.reduce((sum, b) => sum + (b.building_area || 0), 0),
      totalEnergy: buildingsList.reduce((sum, b) => sum + (b.annual_energy || 0), 0),
      totalCarbon: buildingsList.reduce((sum, b) => sum + (b.annual_carbon || 0), 0),
      totalCapture: buildingsList.reduce((sum, b) => sum + (b.carbon_capture || 0), 0),
    }
  }, [buildingsList])

  useEffect(() => {
    let innerTimer: ReturnType<typeof setTimeout>
    const outerTimer = setTimeout(() => {
      setFadeOut(true)
      innerTimer = setTimeout(() => setLoading(false), 600)
    }, 800)
    return () => {
      clearTimeout(outerTimer)
      clearTimeout(innerTimer)
    }
  }, [])

  const handleSearchSelect = useCallback((building: BuildingProperties) => {
    mapHandleRef.current?.selectBuilding(building)
  }, [])

  const handleExport = useCallback(() => {
    exportBuildings()
    exportFloors()
  }, [exportBuildings, exportFloors])

  const handleClearEdits = useCallback(() => {
    clearBuildingEdits()
    clearFloorEdits()
  }, [clearBuildingEdits, clearFloorEdits])

  return (
    <div className="app-container">
      {loading && <Loading fadeOut={fadeOut} />}
      <MapView
        buildingsData={buildingsData}
        onRegisterHandle={(handle) => { mapHandleRef.current = handle }}
        onUpdateBuilding={updateBuilding}
      />
      <TopBar />
      <div className="floating-search">
        <SearchBar buildings={buildingsList} onSelect={handleSearchSelect} />
      </div>

      {/* Campus stats bar */}
      {campusStats && <StatsBar stats={campusStats} />}

      {/* Export / Clear toolbar */}
      {hasEdits && (
        <div className="floating-toolbar">
          <button className="toolbar-btn toolbar-btn--export" onClick={handleExport} title="导出修改后的 GeoJSON 数据">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            导出 GeoJSON
          </button>
          <button className="toolbar-btn toolbar-btn--clear" onClick={handleClearEdits} title="清除所有编辑">
            清除编辑
          </button>
        </div>
      )}
    </div>
  )
}

export default App
