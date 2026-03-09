# config/ — 配置模块

## 文件

### fieldConfig.ts
GeoJSON properties 字段 → UI 展示的映射配置。
- `FIXED_FIELDS`: 代码强依赖的字段（id, height, has_floors），不展示
- `FIELD_CONFIG`: 每个字段的 label、是否在 Tooltip 显示、排序、单位
- `getDisplayFields()`: 给定 properties 对象，返回排序后的可展示字段列表
- 未配置的字段自动兜底展示

**新增字段只需在 FIELD_CONFIG 加一行。**

### mapConfig.ts
地图渲染相关常量：
- 初始视角（经纬度、zoom、pitch、bearing）
- 底图样式 URL
- 建筑颜色（默认/悬停/选中）
- 楼层渐变色计算函数
- 光照材质参数

### theme.ts
主题色常量（暂未在 CSS 中引用，供后续 CSS 变量化使用）：
- 背景色、文字色、强调色、边框、圆角、阴影、动画时间
- 类别徽章配色
