# map/ — 地图模块

## 组件

### MapView.tsx
地图主组件，负责：
- 渲染 deck.gl + MapLibre 底图
- 建筑图层（GeoJsonLayer）
- 楼层图层（SolidPolygonLayer，仅楼层展开时）
- 协调所有交互状态（hover / click / search）

**依赖**: hooks/useBuildings, hooks/useFloors, config/mapConfig, utils/geo

### Tooltip.tsx
鼠标悬停提示，支持两种模式：
- 建筑模式：根据 fieldConfig 展示 showInTooltip=true 的字段
- 楼层模式：展示楼层名和部门

## 数据流

```
useBuildings → buildingsData → GeoJsonLayer
useFloors    → activeFloors  → SolidPolygonLayer
用户交互     → selectedBuilding / hoveredId → 颜色更新 + Tooltip + DetailPanel
SearchBar    → handleSearchSelect → FlyTo + setSelectedBuilding
```
