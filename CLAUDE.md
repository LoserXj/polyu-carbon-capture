# PolyU Carbon Capture

香港理工大学校园建筑三维可视化平台，展示建筑碳捕集相关信息。纯前端静态项目。

## 项目链接

- **GitHub**: https://github.com/LoserXj/polyu-carbon-capture
- **线上地址**: https://loserxj.github.io/polyu-carbon-capture/
- **自动部署**: 推送 main 分支自动触发 GitHub Actions → GitHub Pages

## 技术栈

- React 19 + TypeScript + Vite
- deck.gl 9 + MapLibre GL JS（3D 地图渲染）
- 数据格式：GeoJSON（静态文件，无后端）
- 样式：纯 CSS 文件（白色简洁主题，PolyU 红 #8c1e32 作为强调色）
- 底图：CARTO Positron（白色地图）

## 常用命令

```bash
npm run dev      # 启动开发服务器 http://localhost:5173
npm run build    # 生产构建到 dist/
npm run preview  # 预览生产构建
npm run lint     # ESLint 检查
npm run test     # Vitest 单元测试
```

## 目录结构

```
src/
├── main.tsx                 # 入口
├── App.tsx                  # 根组件（布局 + Loading + 浮动搜索栏）
├── App.css / index.css      # 全局样式
│
├── assets/
│   └── polyu.png            # PolyU 校徽 Logo
│
├── components/
│   ├── map/
│   │   ├── MapView.tsx      # 地图主视图（deck.gl + MapLibre）
│   │   └── Tooltip.tsx      # 悬停提示（建筑/楼层两种模式）
│   ├── panel/
│   │   ├── DetailPanel.tsx  # 右侧建筑详情面板
│   │   ├── FloorList.tsx    # 楼层选择列表
│   │   └── DetailPanel.css
│   ├── search/
│   │   ├── SearchBar.tsx    # 模糊搜索 + 下拉建议
│   │   └── SearchBar.css
│   └── layout/
│       ├── TopBar.tsx       # 顶部品牌栏（Logo + PolyU + 项目名）
│       ├── Loading.tsx      # 加载动画
│       └── *.css
│
├── config/
│   ├── fieldConfig.ts       # GeoJSON 字段→UI 展示的映射配置
│   ├── mapConfig.ts         # 地图视角、底图 URL、建筑颜色
│   └── theme.ts             # 主题色常量（预留 CSS 变量集成）
│
├── hooks/
│   ├── useBuildings.ts      # 加载 buildings.geojson
│   └── useFloors.ts         # 加载 floors.geojson
│
├── types/
│   └── index.ts             # BuildingProperties, FloorProperties, FieldMeta 等
│
└── utils/
    └── geo.ts               # getPolygonCenter, polygonToSolid

public/data/
├── buildings.geojson        # 建筑数据（12 栋模拟数据）
└── floors.geojson           # 楼层数据（创新楼 14 层）

.github/workflows/
└── deploy.yml               # GitHub Pages 自动部署

docs/
├── REQUIREMENTS.md          # 需求文档
├── DEVELOPMENT_PLAN.md      # 开发阶段计划
└── PROJECT_MANAGEMENT.md    # 项目管理方案
```

## 关键架构决策

1. **MapHandle 模式**：App 通过 ref 拿到 MapView 暴露的 `selectBuilding` 方法，实现搜索→地图联动
2. **浮动搜索栏**：SearchBar 不在 TopBar 内，而是作为独立浮动元素挂在 App 层级（避免下拉菜单被 TopBar 裁剪）
3. **配置驱动**：颜色/视角/字段映射都在 config/ 下，组件内不硬编码
4. **数据 Hooks**：useBuildings 和 useFloors 封装 fetch + 解析逻辑，组件只消费数据
5. **Vite base path**：设为 `/polyu-carbon-capture/` 以适配 GitHub Pages 子路径部署

## 快速导航

| 要做什么 | 看哪些文件 |
|---------|-----------|
| 改建筑颜色/地图视角 | `src/config/mapConfig.ts` |
| 改主题色/字体/间距 | `src/config/theme.ts` + 对应 CSS |
| 新增 GeoJSON 字段展示 | `src/config/fieldConfig.ts` |
| 改建筑数据 | `public/data/buildings.geojson` |
| 改楼层数据 | `public/data/floors.geojson` |
| 改地图交互逻辑 | `src/components/map/MapView.tsx` |
| 改详情面板内容/样式 | `src/components/panel/` |
| 改搜索逻辑 | `src/components/search/` |
| 改顶部栏/加载动画 | `src/components/layout/` |
| 改部署配置 | `.github/workflows/deploy.yml` + `vite.config.ts` |
| 加新的数据 Hook | `src/hooks/` |
| 加工具函数 | `src/utils/` |
| 改类型定义 | `src/types/index.ts` |

## 当前状态（截至 2026-03-10）

### 已完成
- 6 个开发阶段全部完成（地图渲染→建筑→Tooltip/面板→楼层展开→搜索→视觉打磨）
- 项目结构重组（按功能域拆分）
- UI 美化：白色主题、TopBar 品牌栏、浮动搜索框、DetailPanel 重设计
- GitHub 仓库创建 + GitHub Pages 自动部署

### 待完成
- 真实 GeoJSON 数据替换（目前为模拟数据）
- 测试基础设施（Vitest 已配置但未编写测试）
- 移动端响应式适配
- theme.ts 的 CSS 变量集成（目前 CSS 值仍为硬编码）
- 更多建筑的楼层数据（目前仅创新楼有楼层）

## 开发规范

### Git 提交格式
```
<type>(<scope>): <description>
type: feat | fix | style | refactor | docs | test | chore
scope: map | panel | search | config | data | build | layout
```

### 代码规范
- 组件：函数式组件 + Hooks，一个文件一个组件
- 样式：每个组件配套同名 CSS 文件
- 配置：行为/外观参数放 config/，不要硬编码在组件里
- 类型：公共类型放 types/index.ts，组件私有类型放组件文件内
- 数据：GeoJSON 放 public/data/，通过 fetch 加载

### 新增功能的标准流程
1. 在对应模块目录了解现有架构
2. 修改/新增代码
3. 更新 CHANGELOG.md
4. 提交代码并推送（自动部署）
