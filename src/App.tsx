import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import MapView from './components/map/MapView'
import TopBar from './components/layout/TopBar'
import SearchBar from './components/search/SearchBar'
import Loading from './components/layout/Loading'
import { useBuildings } from './hooks/useBuildings'
import type { BuildingProperties } from './types'

export interface MapHandle {
  selectBuilding: (building: BuildingProperties) => void
}

function App() {
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const mapHandleRef = useRef<MapHandle | null>(null)
  const { data: buildingsData, list: buildingsList } = useBuildings()

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

  return (
    <div className="app-container">
      {loading && <Loading fadeOut={fadeOut} />}
      <MapView
        buildingsData={buildingsData}
        onRegisterHandle={(handle) => { mapHandleRef.current = handle }}
      />
      <TopBar />
      <div className="floating-search">
        <SearchBar buildings={buildingsList} onSelect={handleSearchSelect} />
      </div>
    </div>
  )
}

export default App
