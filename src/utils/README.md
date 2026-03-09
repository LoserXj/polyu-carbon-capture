# utils/ — 工具函数

### geo.ts
- `getPolygonCenter(feature)`: 计算 Polygon 的几何中心点，用于搜索后的 FlyTo 定位
- `polygonToSolid(coords, baseHeight)`: 将 GeoJSON 坐标转为带 Z 值的 deck.gl SolidPolygonLayer 格式
