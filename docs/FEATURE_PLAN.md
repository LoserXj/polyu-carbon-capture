# 7 Features Implementation Plan

## 依赖关系与执行顺序

```
Feature 5 (扩展数据字段) ← 必须最先
    ├──> Feature 6 (面板图表) ← 依赖新字段
    └──> Feature 7 (校园统计栏) ← 依赖新字段

Feature 1 (毛玻璃效果) ← 独立，CSS only
Feature 2 (面板动效) ← 独立
Feature 3 (底部渐变遮罩) ← 独立，CSS only
Feature 4 (Tooltip 美化) ← 独立
```

**执行顺序:** 5 → 1 → 4 → 3 → 2 → 6 → 7

---

## Feature 5: 扩展建筑数据字段

### 目标
为所有 1409 栋建筑增加 6 个数据字段（模拟数据），后续可替换真实数据。

### 新增字段
| 字段 | 类型 | 说明 | 数据生成规则 |
|------|------|------|-------------|
| building_area | number | 建筑面积 m² | floor_count × (800~5000) |
| year_built | number | 建成年份 | 1960~2024 |
| floor_count | number | 楼层数 | height / 3.5 取整 |
| annual_energy | number | 年能耗 kWh | building_area × (80~200) |
| annual_carbon | number | 年碳排放 tCO₂ | annual_energy × 0.0005 |
| carbon_capture | number | 碳捕集量 tCO₂ | annual_carbon × (5%~40%) |

### 修改文件
1. `src/types/index.ts` — BuildingProperties 增加 6 个字段
2. `src/config/fieldConfig.ts` — 增加 6 个 FIELD_CONFIG 条目
3. `public/data/buildings.geojson` — Python 脚本注入模拟数据

---

## Feature 1: 毛玻璃效果 (Glassmorphism)

### 目标
TopBar、SearchBar、DetailPanel、浮动工具栏加 `backdrop-filter: blur()` 半透明效果。

### 修改文件
1. `src/components/layout/TopBar.css` — background 改为半透明 + blur
2. `src/components/search/SearchBar.css` — 调整透明度，加 -webkit- 前缀
3. `src/components/panel/DetailPanel.css` — background 改为半透明 + blur
4. `src/App.css` — 浮动工具栏加 blur

### 关键 CSS
```css
background: rgba(255, 255, 255, 0.72);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
```

---

## Feature 4: Tooltip 美化

### 目标
更精致的悬停提示：圆角阴影、小箭头、平滑跟随。

### 修改文件
1. `src/components/map/Tooltip.css` — 圆角 + 阴影 + ::before 箭头
2. `src/components/map/Tooltip.tsx` — requestAnimationFrame 平滑位置插值

---

## Feature 3: 底部渐变遮罩

### 目标
地图底部白色渐变，营造"画框感"。

### 修改文件
1. `src/App.css` — `.app-container::after` 伪元素

### CSS
```css
.app-container::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to top, rgba(255,255,255,0.6) 0%, transparent 100%);
  pointer-events: none;
  z-index: 100;
}
```

---

## Feature 2: DetailPanel 动效优化

### 目标
关闭滑出动画 + 字段交错淡入。

### 修改文件
1. `src/components/panel/DetailPanel.css` — slideOut 动画 + fieldFadeIn 交错
2. `src/components/panel/DetailPanel.tsx` — 接收 closing prop
3. `src/components/map/MapView.tsx` — 管理 closing 状态，延迟 300ms 再清除

---

## Feature 6: 面板数据可视化

### 目标
纯 CSS 微型图表：碳捕集率进度条、能耗强度条、碳排放对比条。

### 新建文件
1. `src/components/panel/EnergyCharts.tsx` — 图表组件
2. `src/components/panel/EnergyCharts.css` — 图表样式

### 修改文件
1. `src/components/panel/DetailPanel.tsx` — 集成 EnergyCharts，更新 quickFields

### 图表内容
- **碳捕集率进度条**: carbon_capture / annual_carbon 百分比
- **能耗强度条**: annual_energy / building_area (kWh/m²)，颜色分级
- **碳排放 vs 碳捕集对比条**: 两条水平条并排

---

## Feature 7: 校园总览统计栏

### 目标
底部居中浮动统计栏，显示全校汇总数据。

### 新建文件
1. `src/components/layout/StatsBar.tsx` — 统计栏组件
2. `src/components/layout/StatsBar.css` — 统计栏样式

### 修改文件
1. `src/App.tsx` — useMemo 计算汇总，渲染 StatsBar

### 展示数据
- 总建筑数
- 总面积 (m²)
- 总能耗 (GWh)
- 总碳排放 (tCO₂)
- 总碳捕集 (tCO₂)

---

## 文件变更总览

| 文件 | 涉及 Feature | 操作 |
|------|-------------|------|
| `src/types/index.ts` | 5 | 修改 |
| `src/config/fieldConfig.ts` | 5 | 修改 |
| `public/data/buildings.geojson` | 5 | 脚本修改 |
| `src/components/layout/TopBar.css` | 1 | 修改 |
| `src/components/search/SearchBar.css` | 1 | 修改 |
| `src/components/panel/DetailPanel.css` | 1, 2 | 修改 |
| `src/components/map/Tooltip.css` | 4 | 修改 |
| `src/components/map/Tooltip.tsx` | 4 | 修改 |
| `src/components/map/MapView.tsx` | 2 | 修改 |
| `src/components/panel/DetailPanel.tsx` | 2, 5, 6 | 修改 |
| `src/components/panel/EnergyCharts.tsx` | 6 | **新建** |
| `src/components/panel/EnergyCharts.css` | 6 | **新建** |
| `src/components/layout/StatsBar.tsx` | 7 | **新建** |
| `src/components/layout/StatsBar.css` | 7 | **新建** |
| `src/App.tsx` | 7 | 修改 |
| `src/App.css` | 1, 3 | 修改 |
