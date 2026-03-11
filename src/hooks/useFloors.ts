import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Feature, Polygon } from 'geojson'
import type { FloorProperties } from '../types'

const STORAGE_KEY = 'polyu-floor-edits'

type FloorKey = string // "buildingId:floor"

function makeKey(buildingId: string, floor: number): FloorKey {
  return `${buildingId}:${floor}`
}

function loadEdits(): Record<FloorKey, Partial<FloorProperties>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveEdits(edits: Record<FloorKey, Partial<FloorProperties>>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(edits))
}

export function useFloors(expandedBuildingId: string | null) {
  const [rawFloors, setRawFloors] = useState<Feature<Polygon, FloorProperties>[]>([])
  const [edits, setEdits] = useState<Record<FloorKey, Partial<FloorProperties>>>(loadEdits)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${import.meta.env.BASE_URL}data/floors.geojson`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(data => setRawFloors(data.features))
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Failed to load floors:', err)
          setError(err.message)
        }
      })

    return () => controller.abort()
  }, [])

  const allFloors = useMemo(() => {
    if (Object.keys(edits).length === 0) return rawFloors
    return rawFloors.map(f => {
      const key = makeKey(f.properties.building_id, f.properties.floor)
      const override = edits[key]
      if (!override) return f
      return { ...f, properties: { ...f.properties, ...override } }
    })
  }, [rawFloors, edits])

  const activeFloors = useMemo(() => {
    if (!expandedBuildingId) return []
    return allFloors.filter(f => f.properties.building_id === expandedBuildingId)
  }, [expandedBuildingId, allFloors])

  const updateFloor = useCallback((buildingId: string, floor: number, updates: Partial<FloorProperties>) => {
    setEdits(prev => {
      const key = makeKey(buildingId, floor)
      const next = { ...prev, [key]: { ...prev[key], ...updates } }
      saveEdits(next)
      return next
    })
  }, [])

  const exportGeoJSON = useCallback(() => {
    const geojson = {
      type: 'FeatureCollection' as const,
      features: allFloors,
    }
    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'floors.geojson'
    a.click()
    URL.revokeObjectURL(url)
  }, [allFloors])

  const hasEdits = Object.keys(edits).length > 0

  const clearEdits = useCallback(() => {
    setEdits({})
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { allFloors, activeFloors, error, updateFloor, exportGeoJSON, hasEdits, clearEdits }
}
