# Changelog

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
