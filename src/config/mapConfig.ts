import type { MapViewState } from '@deck.gl/core'

// 香港理工大学校园中心
export const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 114.1795,
  latitude: 22.3045,
  zoom: 16,
  pitch: 45,
  bearing: -17,
}

// CARTO 亮色底图
export const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'

// 建筑颜色（白色底图上用更深、更饱和的色值）
export const COLOR_DEFAULT: [number, number, number, number] = [200, 200, 205, 200]
export const COLOR_HOVER: [number, number, number, number] = [170, 170, 180, 220]
export const COLOR_SELECTED: [number, number, number, number] = [140, 30, 50, 240]

// 楼层渐变色：PolyU 红色系，低层深、高层浅
export function getFloorColor(
  floor: number,
  totalFloors: number,
  isHovered: boolean,
  isHighlighted: boolean
): [number, number, number, number] {
  if (isHovered) return [220, 60, 80, 230]
  if (isHighlighted) return [240, 80, 100, 240]
  const t = floor / totalFloors
  const r = Math.round(120 + t * 60)
  const g = Math.round(20 + t * 40)
  const b = Math.round(35 + t * 50)
  return [r, g, b, 190]
}

// 光照材质（白色底图上需要更亮的材质）
export const BUILDING_MATERIAL = {
  ambient: 0.5,
  diffuse: 0.7,
  shininess: 40,
  specularColor: [60, 60, 60] as [number, number, number],
}

export const FLOOR_MATERIAL = {
  ambient: 0.5,
  diffuse: 0.7,
  shininess: 40,
  specularColor: [60, 60, 60] as [number, number, number],
}
