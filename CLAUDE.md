# PolyU Carbon Capture

香港理工大学校园建筑三维可视化平台，展示建筑碳捕集相关信息。纯前端静态项目。

## 技术栈

- React 19 + TypeScript + Vite
- deck.gl 9 + MapLibre GL JS（3D 地图渲染）
- 数据格式：GeoJSON（静态文件，无后端）
- 样式：CSS 文件（暗色科技主题）

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
├── App.tsx                  # 根组件（布局 + Loading）
├── App.css / index.css      # 全局样式
│
├── components/
│   ├── map/                 # 地图主视图 + Tooltip
│   ├── panel/               # 右侧详情面板 + 楼层列表
│   ├── search/              # 搜索框 + 下拉建议
│   └── layout/              # TopBar、Loading 等布局组件
│
├── config/
│   ├── fieldConfig.ts       # GeoJSON 字段→UI 展示的映射配置
│   ├── mapConfig.ts         # 地图视角、底图 URL、建筑颜色
│   └── theme.ts             # 主题色常量（所有 CSS 引用这里的值）
│
├── hooks/
│   ├── useBuildings.ts      # 加载 buildings.geojson
│   └── useFloors.ts         # 加载 floors.geojson
│
├── types/
│   └── index.ts             # BuildingProperties, FloorProperties, FieldMeta 等
│
└── utils/
    └── geo.ts               # getPolygonCenter 等地理计算

public/data/
├── buildings.geojson        # 建筑数据（12 栋模拟数据）
└── floors.geojson           # 楼层数据（创新楼 14 层）

docs/
├── REQUIREMENTS.md          # 需求文档
├── DEVELOPMENT_PLAN.md      # 开发阶段计划
└── PROJECT_MANAGEMENT.md    # 项目管理方案
```

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
| 加新的数据 Hook | `src/hooks/` |
| 加工具函数 | `src/utils/` |
| 改类型定义 | `src/types/index.ts` |

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
1. 在对应模块目录的 README.md 了解现有架构
2. 修改/新增代码
3. 更新 CHANGELOG.md
4. 提交到功能分支，创建 PR
