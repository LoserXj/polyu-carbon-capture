import { useState, useEffect, useMemo } from 'react'
import type { FeatureCollection } from 'geojson'
import type { BuildingProperties } from '../types'

export function useBuildings() {
  const [data, setData] = useState<FeatureCollection | null>(null)

  useEffect(() => {
    fetch('/data/buildings.geojson')
      .then(res => res.json())
      .then(setData)
  }, [])

  const list = useMemo<BuildingProperties[]>(() => {
    if (!data) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.features.map((f: any) => f.properties)
  }, [data])

  return { data, list }
}
