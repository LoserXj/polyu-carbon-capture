import type { Feature, Polygon } from 'geojson'

/**
 * 计算 Polygon 的几何中心点
 */
export function getPolygonCenter(feature: Feature<Polygon>): [number, number] {
  const coords = feature.geometry.coordinates[0]
  let lngSum = 0, latSum = 0
  for (const [lng, lat] of coords) {
    lngSum += lng
    latSum += lat
  }
  return [lngSum / coords.length, latSum / coords.length]
}

/**
 * 将 GeoJSON Polygon 坐标转成 deck.gl SolidPolygonLayer 需要的带 Z 值格式
 */
export function polygonToSolid(coords: number[][][], baseHeight: number): number[][][] {
  return coords.map(ring =>
    ring.map(([lng, lat]) => [lng, lat, baseHeight])
  )
}
