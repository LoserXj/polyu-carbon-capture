# PolyU Carbon Capture - 需求文档

## 1. 项目概述

基于 Web 的香港理工大学校园建筑三维可视化平台，用于展示建筑碳捕集相关信息。用户可以在 3D 地图上浏览校园建筑、查看建筑详情、搜索定位建筑，并对特定建筑进行逐层信息查看。

## 2. 技术栈

| 类别 | 选型 |
|------|------|
| 前端框架 | React 18+ |
| 构建工具 | Vite |
| 地图渲染 | deck.gl + MapLibre GL JS（开源底图） |
| 语言 | TypeScript |
| 样式方案 | CSS Modules / Styled Components |
| 数据格式 | GeoJSON（静态文件，无后端） |

## 3. 数据结构

### 3.1 建筑数据 (buildings.geojson)

普通建筑（整体拉伸）：

```json
{
  "type": "Feature",
  "properties": {
    "id": "building_001",
    "name_en": "Li Ka Shing Tower",
    "name_zh": "李嘉诚楼",
    "height": 45,
    "category": "academic",
    "departments": ["电子计算学系", "应用数学系"],
    "description": "建筑简介...",
    "has_floors": false
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[lng, lat], ...]]
  }
}
```

### 3.2 楼层数据 (floors.geojson)

仅一栋建筑具有楼层展开功能，每层为独立 Feature：

```json
{
  "type": "Feature",
  "properties": {
    "building_id": "building_001",
    "floor": 3,
    "floor_name": "3/F",
    "base_height": 8,
    "top_height": 12,
    "departments": ["电子计算学系办公室"],
    "description": "该层详细信息..."
  },
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[lng, lat, 8], ...]]
  }
}
```

说明：
- polygon 坐标带 Z 值（= base_height），用于 deck.gl 设定拉伸基底
- `getElevation = top_height - base_height`，控制每层拉伸高度
- 楼层间间隙设为 0.3m，视觉上可区分但不产生悬浮感

## 4. 功能需求

### 4.1 地图与建筑渲染

- [ ] 加载 MapLibre 暗色底图作为基础地图
- [ ] 使用 deck.gl GeoJsonLayer 渲染所有建筑的 3D 拉伸效果
- [ ] 初始视角定位到香港理工大学校园中心
- [ ] 支持地图旋转、缩放、倾斜交互

### 4.2 建筑交互 - 悬停 Tooltip

- [ ] 鼠标悬停建筑时，建筑高亮（颜色变化）
- [ ] 显示轻量 Tooltip：建筑名称（中英文）、类别
- [ ] 鼠标移出后 Tooltip 消失、高亮取消

### 4.3 建筑交互 - 点击详情面板

- [ ] 点击建筑，右侧滑出详情面板（侧边栏）
- [ ] 面板内容：建筑名称、楼高、类别、部门列表、简介
- [ ] 若该建筑支持楼层展开（has_floors=true），面板中显示楼层选择器
- [ ] 再次点击空白区域或关闭按钮收起面板

### 4.4 楼层展开功能（仅一栋建筑）

- [ ] 点击该建筑后，该建筑从整体拉伸切换为逐层渲染
- [ ] 每层独立着色（同色系渐变，低层深、高层浅）
- [ ] 层间间隙 0.3m，保持视觉连续性
- [ ] 悬停某层 → 高亮该层 + Tooltip 显示层信息
- [ ] 侧边栏中点击楼层 → 地图上对应层高亮
- [ ] 点击其他建筑或关闭面板 → 楼层合并回整体

### 4.5 搜索功能

- [ ] 顶部搜索框，支持中英文模糊搜索
- [ ] 输入时实时显示下拉建议列表（autocomplete）
- [ ] 选中搜索结果 → 地图飞行定位到该建筑 + 高亮 + 自动打开详情面板
- [ ] 支持 Enter 键确认搜索

### 4.6 UI 布局

```
+--------------------------------------------------+
|  [搜索框]                              [项目标题]  |
+--------------------------------------------------+
|                                    |              |
|                                    |   详情面板    |
|           3D 地图区域               |  （可收起）   |
|                                    |              |
|                                    |              |
+--------------------------------------------------+
```

## 5. 视觉规范

### 5.1 整体风格
- 暗色科技主题
- 底图：MapLibre Dark Matter 或类似暗色风格
- 建筑默认色：半透明蓝绿色系（符合碳捕集/环保主题）

### 5.2 建筑颜色
- 默认状态：`rgba(0, 200, 180, 0.6)` 青绿色
- 悬停高亮：`rgba(0, 255, 220, 0.8)` 亮青色
- 选中状态：`rgba(255, 200, 0, 0.8)` 金色
- 楼层展开：同色系渐变，从深到浅

### 5.3 UI 组件
- 面板背景：`rgba(20, 20, 30, 0.9)` 半透明深色
- 文字颜色：`#E0E0E0` 浅灰
- 强调色：`#00C8B4` 青绿
- 圆角、微阴影、过渡动画

## 6. 可扩展性设计

### 6.1 数据字段约定

GeoJSON properties 中的字段分为两类：

**固定字段（代码强依赖，必须存在）：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 建筑唯一标识 |
| `height` | number | 建筑总高度（米） |
| `has_floors` | boolean | 是否支持楼层展开 |

**动态字段（可随时增删，UI 自动适配）：**

GeoJSON properties 中除固定字段外的所有字段，均视为动态属性，自动渲染到详情面板和 Tooltip 中。

### 6.2 字段配置表

通过集中式配置控制字段的显示行为，新增字段只需加一行配置：

```ts
// config/fieldConfig.ts
export const FIELD_CONFIG: Record<string, FieldMeta> = {
  name_zh:      { label: '名称',   showInTooltip: true,  order: 1 },
  name_en:      { label: 'Name',   showInTooltip: true,  order: 2 },
  height:       { label: '楼高',   showInTooltip: true,  order: 3, unit: 'm' },
  category:     { label: '类别',   showInTooltip: false, order: 4 },
  departments:  { label: '部门',   showInTooltip: false, order: 5 },
  // 未来新增字段在此添加...
}
```

**兜底机制**：未在配置表中的字段 → 使用字段名作为 label，值直接展示，排在已配置字段之后。

### 6.3 渲染规则

根据字段值类型自动选择渲染方式：

| 值类型 | 渲染方式 |
|--------|----------|
| `string` | 文本直接展示 |
| `number` | 格式化数值 + 单位（如有配置） |
| `string[]` | 标签列表 / 逗号分隔 |
| `boolean` | 是/否 |
| `object` | JSON 折叠展示 |

这样无论 GeoJSON 数据怎么变化，只要 `id`、`height`、`geometry` 存在，UI 就能正常工作并自动展示所有新增信息。

## 7. 非功能需求

- 纯前端静态部署，无需后端
- 响应式布局（桌面端优先，移动端基本可用）
- 首屏加载 < 3s
- 流畅的 60fps 地图交互

## 7. 待验证技术风险

- [ ] deck.gl SolidPolygonLayer 对 3D 坐标（Z 值作为基底）的支持验证
- [ ] 楼层间隙渲染效果验证（0.3m 是否足够区分又不悬浮）
