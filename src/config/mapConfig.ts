import type { MapViewState } from '@deck.gl/core'

// 香港理工大学校园中心
export const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 114.1795,
  latitude: 22.3045,
  zoom: 16,
  pitch: 45,
  bearing: -17,
}

// CARTO 免费暗色瓦片
export const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'

// 建筑颜色
export const COLOR_DEFAULT: [number, number, number, number] = [0, 200, 180, 160]
export const COLOR_HOVER: [number, number, number, number] = [0, 255, 220, 200]
export const COLOR_SELECTED: [number, number, number, number] = [255, 200, 0, 200]

// 楼层渐变色：从深到浅
export function getFloorColor(
  floor: number,
  totalFloors: number,
  isHovered: boolean,
  isHighlighted: boolean
): [number, number, number, number] {
  if (isHovered) return [0, 255, 220, 220]
  if (isHighlighted) return [255, 200, 0, 220]
  const t = floor / totalFloors
  const r = Math.round(0 + t * 40)
  const g = Math.round(120 + t * 100)
  const b = Math.round(130 + t * 80)
  return [r, g, b, 180]
}

// 光照材质
export const BUILDING_MATERIAL = {
  ambient: 0.35,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [30, 30, 30] as [number, number, number],
}

export const FLOOR_MATERIAL = {
  ambient: 0.4,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [30, 30, 30] as [number, number, number],
}
