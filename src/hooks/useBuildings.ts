import { useState, useEffect, useMemo, useCallback } from 'react'
import type { FeatureCollection } from 'geojson'
import type { BuildingProperties } from '../types'

const STORAGE_KEY = 'polyu-building-edits'

function loadEdits(): Record<string, Partial<BuildingProperties>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveEdits(edits: Record<string, Partial<BuildingProperties>>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(edits))
}

function applyEdits(
  data: FeatureCollection,
  edits: Record<string, Partial<BuildingProperties>>
): FeatureCollection {
  if (Object.keys(edits).length === 0) return data
  return {
    ...data,
    features: data.features.map((f: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
      const id = f.properties?.id
      const override = id ? edits[id] : undefined
      if (!override) return f
      return { ...f, properties: { ...f.properties, ...override } }
    }),
  }
}

export function useBuildings() {
  const [rawData, setRawData] = useState<FeatureCollection | null>(null)
  const [edits, setEdits] = useState<Record<string, Partial<BuildingProperties>>>(loadEdits)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${import.meta.env.BASE_URL}data/buildings.geojson`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setRawData)
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Failed to load buildings:', err)
          setError(err.message)
        }
      })

    return () => controller.abort()
  }, [])

  const data = useMemo(() => {
    if (!rawData) return null
    return applyEdits(rawData, edits)
  }, [rawData, edits])

  const list = useMemo<BuildingProperties[]>(() => {
    if (!data) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.features.map((f: any) => f.properties)
  }, [data])

  const updateBuilding = useCallback((id: string, updates: Partial<BuildingProperties>) => {
    setEdits(prev => {
      const next = { ...prev, [id]: { ...prev[id], ...updates } }
      saveEdits(next)
      return next
    })
  }, [])

  const exportGeoJSON = useCallback(() => {
    if (!data) return
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'buildings.geojson'
    a.click()
    URL.revokeObjectURL(url)
  }, [data])

  const hasEdits = Object.keys(edits).length > 0

  const clearEdits = useCallback(() => {
    setEdits({})
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { data, list, error, updateBuilding, exportGeoJSON, hasEdits, clearEdits }
}
