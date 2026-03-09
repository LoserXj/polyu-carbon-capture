import { useState, useCallback, useMemo } from 'react'
import { Map } from 'react-map-gl/maplibre'
import DeckGL from '@deck.gl/react'
import { GeoJsonLayer, SolidPolygonLayer } from '@deck.gl/layers'
import { FlyToInterpolator } from '@deck.gl/core'
import 'maplibre-gl/dist/maplibre-gl.css'

import Tooltip from './Tooltip'
import DetailPanel from '../panel/DetailPanel'
import SearchBar from '../search/SearchBar'

import { useBuildings } from '../../hooks/useBuildings'
import { useFloors } from '../../hooks/useFloors'
import { getPolygonCenter, polygonToSolid } from '../../utils/geo'
import {
  INITIAL_VIEW_STATE, MAP_STYLE,
  COLOR_DEFAULT, COLOR_HOVER, COLOR_SELECTED,
  getFloorColor, BUILDING_MATERIAL, FLOOR_MATERIAL,
} from '../../config/mapConfig'

import type { ViewStateChangeParameters, MapViewState, PickingInfo } from '@deck.gl/core'
import type { Feature, Polygon } from 'geojson'
import type { BuildingProperties, FloorProperties } from '../../types'

interface HoverInfo {
  x: number
  y: number
  properties: BuildingProperties | FloorProperties
  isFloor?: boolean
}

export default function MapView() {
  const [viewState, setViewState] = useState<MapViewState>(INITIAL_VIEW_STATE)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null)
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)
  const [selectedBuilding, setSelectedBuilding] = useState<BuildingProperties | null>(null)
  const [highlightedFloor, setHighlightedFloor] = useState<number | null>(null)

  const { data: buildingsData, list: buildingsList } = useBuildings()

  const isFloorMode = selectedBuilding?.has_floors === true
  const expandedBuildingId = isFloorMode ? selectedBuilding.id : null

  const { activeFloors } = useFloors(expandedBuildingId)
  const totalFloors = activeFloors.length

  const filteredBuildingsData = useMemo(() => {
    if (!buildingsData || !expandedBuildingId) return buildingsData
    return {
      ...buildingsData,
      features: buildingsData.features.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (f: any) => f.properties?.id !== expandedBuildingId
      ),
    }
  }, [buildingsData, expandedBuildingId])

  const onViewStateChange = useCallback(({ viewState }: ViewStateChangeParameters) => {
    setViewState(viewState as MapViewState)
  }, [])

  const onBuildingHover = useCallback((info: PickingInfo) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = (info.object as any)?.properties as BuildingProperties | undefined
    if (props) {
      setHoveredId(props.id)
      setHoverInfo({ x: info.x, y: info.y, properties: props })
    } else {
      setHoveredId(null)
      setHoverInfo(null)
    }
  }, [])

  const onBuildingClick = useCallback((info: PickingInfo) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props = (info.object as any)?.properties as BuildingProperties | undefined
    if (props) {
      setSelectedBuilding(props)
      setHighlightedFloor(null)
      setHoveredFloor(null)
    }
  }, [])

  const onFloorHover = useCallback((info: PickingInfo) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = info.object as any
    if (data?.properties) {
      setHoveredFloor(data.properties.floor)
      setHoverInfo({ x: info.x, y: info.y, properties: data.properties, isFloor: true })
    } else {
      setHoveredFloor(null)
      setHoverInfo(null)
    }
  }, [])

  const handleClose = useCallback(() => {
    setSelectedBuilding(null)
    setHighlightedFloor(null)
    setHoveredFloor(null)
  }, [])

  const handleFloorSelect = useCallback((floor: number | null) => {
    setHighlightedFloor(floor)
  }, [])

  const handleSearchSelect = useCallback((building: BuildingProperties) => {
    if (!buildingsData) return
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const feature = buildingsData.features.find((f: any) => f.properties?.id === building.id)
    if (!feature) return

    const [lng, lat] = getPolygonCenter(feature as Feature<Polygon>)

    setViewState({
      longitude: lng,
      latitude: lat,
      zoom: 17.5,
      pitch: 50,
      bearing: -17,
      transitionDuration: 1200,
      transitionInterpolator: new FlyToInterpolator(),
    } as any) // eslint-disable-line @typescript-eslint/no-explicit-any

    setSelectedBuilding(building)
    setHighlightedFloor(null)
    setHoveredFloor(null)
  }, [buildingsData])

  const selectedId = selectedBuilding?.id ?? null

  const floorPolygons = useMemo(() => {
    return activeFloors.map(f => ({
      polygon: polygonToSolid(f.geometry.coordinates, f.properties.base_height),
      properties: f.properties,
      elevation: f.properties.top_height - f.properties.base_height,
    }))
  }, [activeFloors])

  const layers = []

  if (filteredBuildingsData) {
    layers.push(
      new GeoJsonLayer({
        id: 'buildings',
        data: filteredBuildingsData,
        extruded: true,
        wireframe: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getElevation: (f: any) => f.properties?.height ?? 10,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getFillColor: (f: any) => {
          const id = f.properties?.id
          if (id === selectedId) return COLOR_SELECTED
          if (id === hoveredId) return COLOR_HOVER
          return COLOR_DEFAULT
        },
        material: BUILDING_MATERIAL,
        pickable: true,
        onHover: onBuildingHover,
        onClick: onBuildingClick,
        updateTriggers: {
          getFillColor: [hoveredId, selectedId],
        },
      })
    )
  }

  if (isFloorMode && floorPolygons.length > 0) {
    layers.push(
      new SolidPolygonLayer({
        id: 'floors',
        data: floorPolygons,
        extruded: true,
        wireframe: true,
        getPolygon: (d: any) => d.polygon[0], // eslint-disable-line @typescript-eslint/no-explicit-any
        getElevation: (d: any) => d.elevation, // eslint-disable-line @typescript-eslint/no-explicit-any
        getFillColor: (d: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
          const floor = d.properties.floor
          return getFloorColor(floor, totalFloors, floor === hoveredFloor, floor === highlightedFloor)
        },
        getLineColor: [0, 200, 180, 60],
        material: FLOOR_MATERIAL,
        pickable: true,
        onHover: onFloorHover,
        updateTriggers: {
          getFillColor: [hoveredFloor, highlightedFloor, totalFloors],
        },
      })
    )
  }

  const showBuildingTooltip = hoverInfo && !hoverInfo.isFloor && !selectedBuilding
  const showFloorTooltip = hoverInfo && hoverInfo.isFloor && isFloorMode
  const cursorStyle = hoveredId || hoveredFloor ? 'pointer' : 'grab'

  return (
    <div className="map-container" style={{ cursor: cursorStyle }}>
      <DeckGL
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        controller={true}
        layers={layers}
        getCursor={() => cursorStyle}
        onClick={(info) => {
          if (!info.object) handleClose()
        }}
      >
        <Map mapStyle={MAP_STYLE} attributionControl={false} />
      </DeckGL>

      <SearchBar buildings={buildingsList} onSelect={handleSearchSelect} />

      {(showBuildingTooltip || showFloorTooltip) && hoverInfo && (
        <Tooltip
          x={hoverInfo.x}
          y={hoverInfo.y}
          properties={hoverInfo.properties}
          isFloor={hoverInfo.isFloor}
        />
      )}

      {selectedBuilding && (
        <DetailPanel
          properties={selectedBuilding}
          floors={isFloorMode ? activeFloors : undefined}
          highlightedFloor={highlightedFloor}
          onFloorSelect={handleFloorSelect}
          onClose={handleClose}
        />
      )}
    </div>
  )
}
