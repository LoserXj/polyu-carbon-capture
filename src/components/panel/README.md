# panel/ — 详情面板模块

## 组件

### DetailPanel.tsx
右侧滑入的建筑详情面板，负责：
- 展示建筑名称、英文名
- 根据 fieldConfig 动态渲染所有字段
- category 字段特殊渲染为彩色徽章
- 若建筑支持楼层展开，渲染 FloorList

**Props**: properties, floors?, highlightedFloor, onFloorSelect, onClose

### FloorList.tsx
楼层选择器列表，从 DetailPanel 拆出。
- 按楼层从高到低排列
- 点击切换高亮，联动地图上的楼层颜色

**Props**: floors, highlightedFloor, onFloorSelect
