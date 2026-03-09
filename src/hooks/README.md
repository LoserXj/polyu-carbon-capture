# hooks/ — 自定义 Hooks

### useBuildings.ts
加载 buildings.geojson，返回：
- `data`: 原始 FeatureCollection（供 GeoJsonLayer 使用）
- `list`: BuildingProperties[]（供 SearchBar 使用）

### useFloors.ts
加载 floors.geojson，根据 expandedBuildingId 过滤，返回：
- `allFloors`: 全部楼层数据
- `activeFloors`: 当前展开建筑的楼层
