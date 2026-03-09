import { useState, useEffect, useMemo } from 'react'
import type { Feature, Polygon } from 'geojson'
import type { FloorProperties } from '../types'

export function useFloors(expandedBuildingId: string | null) {
  const [allFloors, setAllFloors] = useState<Feature<Polygon, FloorProperties>[]>([])

  useEffect(() => {
    fetch('/data/floors.geojson')
      .then(res => res.json())
      .then(data => setAllFloors(data.features))
  }, [])

  const activeFloors = useMemo(() => {
    if (!expandedBuildingId) return []
    return allFloors.filter(f => f.properties.building_id === expandedBuildingId)
  }, [expandedBuildingId, allFloors])

  return { allFloors, activeFloors }
}
