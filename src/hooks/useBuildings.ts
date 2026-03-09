import { useState, useEffect, useMemo } from 'react'
import type { FeatureCollection } from 'geojson'
import type { BuildingProperties } from '../types'

export function useBuildings() {
  const [data, setData] = useState<FeatureCollection | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${import.meta.env.BASE_URL}data/buildings.geojson`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json()
      })
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') {
          console.error('Failed to load buildings:', err)
          setError(err.message)
        }
      })

    return () => controller.abort()
  }, [])

  const list = useMemo<BuildingProperties[]>(() => {
    if (!data) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.features.map((f: any) => f.properties)
  }, [data])

  return { data, list, error }
}
