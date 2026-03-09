import type { Feature, Polygon } from 'geojson'

/**
 * 计算 Polygon 的面积加权质心（Centroid）
 * 使用 Shoelace 公式，适用于简单多边形（含凹多边形）
 */
export function getPolygonCenter(feature: Feature<Polygon>): [number, number] {
  const coords = feature.geometry.coordinates[0]
  const n = coords.length

  // 去掉闭合重复点
  const len = (n > 1 && coords[0][0] === coords[n - 1][0] && coords[0][1] === coords[n - 1][1])
    ? n - 1
    : n

  let area = 0
  let cx = 0
  let cy = 0

  for (let i = 0; i < len; i++) {
    const j = (i + 1) % len
    const cross = coords[i][0] * coords[j][1] - coords[j][0] * coords[i][1]
    area += cross
    cx += (coords[i][0] + coords[j][0]) * cross
    cy += (coords[i][1] + coords[j][1]) * cross
  }

  area *= 0.5

  // 退化情况（面积为 0）回退到顶点平均值
  if (Math.abs(area) < 1e-12) {
    let lngSum = 0, latSum = 0
    for (let i = 0; i < len; i++) {
      lngSum += coords[i][0]
      latSum += coords[i][1]
    }
    return [lngSum / len, latSum / len]
  }

  const factor = 1 / (6 * area)
  return [cx * factor, cy * factor]
}

/**
 * 将 GeoJSON Polygon 坐标转成 deck.gl SolidPolygonLayer 需要的带 Z 值格式
 */
export function polygonToSolid(coords: number[][][], baseHeight: number): number[][][] {
  return coords.map(ring =>
    ring.map(([lng, lat]) => [lng, lat, baseHeight])
  )
}
