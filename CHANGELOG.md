# Changelog

## [0.3.0] - 2026-03-10

### Changed
- 替换建筑数据为真实 PolyU 校园 building footprint（1409 栋建筑，来源 polyu.geojson）
- 为所有建筑生成占位属性（id、name、category、departments、description）
- 选取 B0015（64m，18 层）作为示例楼层建筑，生成楼层数据
- 保留原始 polyu.geojson 作为数据源备份

### Notes
- 建筑名称目前为占位符（建筑 B0001 等），后续逐栋替换真实名称
- 类别分布：facility 601 / academic 440 / administrative 233 / residential 135

## [0.2.0] - 2026-03-10

### Added
- GitHub Pages 自动部署（`.github/workflows/deploy.yml`）
- 浮动搜索栏（从 TopBar 移至地图左上角独立悬浮）

### Changed
- 全站切换为白色主题（CARTO Positron 底图 + 白色 UI）
- TopBar 重设计：白色背景 + PolyU Logo 融合 + 品牌文字黑色
- DetailPanel 重设计：类别徽章、快速统计行、分段式详情、红色左边框强调
- SearchBar 下拉菜单改为 `position: absolute`，修复输入时文字被遮挡的问题
- 建筑颜色统一为 PolyU 红色系（#8c1e32）
- Loading 动画适配白色主题

### Fixed
- 搜索栏打字时下拉列表把输入框顶上去导致看不见文字

## [0.1.0] - 2026-03-09

### Added
- Phase 1: Vite + React + TypeScript 项目初始化，暗色底图 (CARTO Dark Matter)
- Phase 2: 12 栋模拟建筑 GeoJSON 数据 + deck.gl 3D 拉伸渲染
- Phase 3: 建筑悬停 Tooltip + 点击右侧详情面板（滑入动画）
- Phase 4: 创新楼楼层展开功能（14 层，渐变色，层间间隙 0.3m，侧栏联动）
- Phase 5: 中英文模糊搜索 + 下拉建议 + FlyTo 定位
- Phase 6: 视觉打磨（加载动画、类别徽章、Tooltip 动画、顶部标题栏）

### Changed
- 项目结构重组：按功能域拆分为 map/ panel/ search/ layout/ 子目录
- 提取 mapConfig / theme / fieldConfig 配置模块
- 提取 useBuildings / useFloors 数据加载 Hooks
- 提取 geo.ts 工具函数
- Vite 手动分包（maplibre / deck.gl 独立 chunk）

### Documentation
- 创建 CLAUDE.md（AI 协作入口）
- 创建各模块 README.md
- 创建项目管理方案 docs/PROJECT_MANAGEMENT.md
