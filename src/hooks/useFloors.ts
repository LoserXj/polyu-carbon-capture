import { useState, useEffect, useMemo } from 'react'
import type { Feature, Polygon } from 'geojson'
import type { FloorProperties } from '../types'

export function useFloors(expandedBuildingId: string | null) {
  const [allFloors, setAllFloors] = useState<Feature<Polygon, FloorProperties>[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${import.meta.env.BASE_URL}data/floors.geojson`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => setAllFloors(data.features))
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Failed to load floors:', err)
          setError(err.message)
        }
      })

    return () => controller.abort()
  }, [])

  const activeFloors = useMemo(() => {
    if (!expandedBuildingId) return []
    return allFloors.filter(f => f.properties.building_id === expandedBuildingId)
  }, [expandedBuildingId, allFloors])

  return { allFloors, activeFloors, error }
}
