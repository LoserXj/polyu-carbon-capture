# PolyU Carbon Capture — 项目管理方案

## 一、问题与目标

| 问题 | 解决方案 |
|------|---------|
| 项目变大后 AI 读不完整个代码库 | 模块化拆分 + CLAUDE.md 入口 + 模块级 README |
| 不知道改了什么 | CHANGELOG + Git 规范提交 |
| 多人/多次协作容易冲突 | Git 分支策略 + 功能分支开发 |
| 代码质量无法保证 | 测试体系 + CI 自动检查 |
| 部署繁琐 | GitHub Actions 自动部署 |

---

## 二、目录结构重组

当前结构偏平，所有组件混在一起。重组为**按职责分层**：

```
polyu-carbon/
├── CLAUDE.md                    # AI 入口文件（自动加载）
├── CHANGELOG.md                 # 变更记录
├── package.json
├── vite.config.ts
├── tsconfig*.json
├── .github/
│   └── workflows/
│       ├── ci.yml               # PR 检查（lint + type-check + test）
│       └── deploy.yml           # 自动部署
│
├── docs/
│   ├── REQUIREMENTS.md          # 需求文档
│   ├── DEVELOPMENT_PLAN.md      # 开发计划
│   └── PROJECT_MANAGEMENT.md    # 本文件
│
├── public/
│   └── data/
│       ├── buildings.geojson    # 建筑数据
│       └── floors.geojson       # 楼层数据
│
├── src/
│   ├── main.tsx                 # 应用入口
│   ├── App.tsx                  # 根组件 + 布局
│   ├── App.css                  # 全局布局样式
│   ├── index.css                # CSS Reset + 全局变量
│   │
│   ├── components/              # UI 组件（按功能域分子目录）
│   │   ├── map/                 # 地图相关
│   │   │   ├── MapView.tsx      # 地图主组件
│   │   │   ├── MapView.css
│   │   │   ├── Tooltip.tsx      # 悬停提示
│   │   │   ├── Tooltip.css
│   │   │   └── README.md        # 地图模块说明
│   │   │
│   │   ├── panel/               # 侧边面板
│   │   │   ├── DetailPanel.tsx  # 建筑详情面板
│   │   │   ├── DetailPanel.css
│   │   │   ├── FloorList.tsx    # 楼层列表（从 DetailPanel 拆出）
│   │   │   └── README.md
│   │   │
│   │   ├── search/              # 搜索
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchBar.css
│   │   │   └── README.md
│   │   │
│   │   └── layout/              # 布局组件
│   │       ├── TopBar.tsx       # 顶部栏（从 App 拆出）
│   │       ├── TopBar.css
│   │       └── Loading.tsx      # 加载态
│   │
│   ├── config/                  # 配置
│   │   ├── fieldConfig.ts       # 字段显示配置
│   │   ├── mapConfig.ts         # 地图配置（视角、底图、颜色）
│   │   ├── theme.ts             # 主题色/样式常量
│   │   └── README.md
│   │
│   ├── hooks/                   # 自定义 Hooks
│   │   ├── useBuildings.ts      # 建筑数据加载
│   │   ├── useFloors.ts         # 楼层数据加载
│   │   └── README.md
│   │
│   ├── types/                   # TypeScript 类型
│   │   └── index.ts
│   │
│   └── utils/                   # 工具函数
│       ├── geo.ts               # 地理计算（polygon 中心等）
│       └── README.md
│
└── tests/                       # 测试文件
    ├── components/
    └── utils/
```

### 重组原则

1. **每个子目录不超过 5-7 个文件** — AI 一次就能读完
2. **每个子目录有 README.md** — AI 只需读 README 就知道该目录做什么
3. **配置集中在 config/** — 改行为不需要动组件代码
4. **逻辑抽到 hooks/** — 组件只管渲染，逻辑可独立测试

---

## 三、CLAUDE.md 设计

放在项目根目录，AI 每次自动加载。核心内容：

1. **项目概述**（3 行）
2. **技术栈**（列表）
3. **目录结构**（树形 + 一句话说明）
4. **快速导航表**（"要改 X → 看这些文件"）
5. **开发规范**（命名、提交、分支）
6. **常用命令**（dev/build/test/deploy）

控制在 150 行以内，绝不放具体代码。

---

## 四、AI 协作工作流

### 4.1 任务范围控制

每次给 AI 的任务遵循 **"单一职责"原则**：

```
❌ "把界面美化一下"（太大，AI 需要读所有文件）
✅ "美化 DetailPanel 的样式，参考 docs/ 里的视觉规范"（只需读 2-3 个文件）
```

### 4.2 AI 工作流程

```
1. AI 读 CLAUDE.md → 理解项目全貌
2. 根据任务，读对应模块的 README.md → 理解局部架构
3. 读具体文件 → 修改代码
4. 更新 CHANGELOG.md → 记录改了什么
5. 提交 → CI 自动检查
```

### 4.3 任务拆分模板

每个功能需求拆成这样的小任务：

```markdown
## 任务：[功能名]
- 影响范围：src/components/panel/
- 需要读的文件：DetailPanel.tsx, DetailPanel.css, README.md
- 产出：[描述]
- 验证方式：[如何确认完成]
```

---

## 五、Git 工作流

### 5.1 分支策略

```
main              ← 稳定版本，部署用
  └── dev         ← 开发主线
       ├── feat/search-enhancement   ← 功能分支
       ├── fix/tooltip-overflow      ← 修复分支
       └── style/panel-redesign      ← 样式分支
```

### 5.2 提交规范

```
<type>(<scope>): <description>

type:  feat | fix | style | refactor | docs | test | chore
scope: map | panel | search | config | data | build
```

示例：
```
feat(panel): add floor gradient color indicator
fix(search): handle empty query edge case
style(tooltip): add fade-in animation
docs: update CLAUDE.md with new module structure
```

### 5.3 PR 流程

```
功能分支 → PR → CI 通过 → Review → 合并到 dev → 定期合并到 main
```

---

## 六、测试策略

### 6.1 工具选型

| 工具 | 用途 |
|------|------|
| Vitest | 单元测试（与 Vite 原生集成） |
| @testing-library/react | 组件测试 |
| Playwright（可选） | E2E 测试 |

### 6.2 测试范围（优先级排序）

| 优先级 | 范围 | 示例 |
|--------|------|------|
| P0 | 配置/工具函数 | fieldConfig 的字段解析、geo 计算 |
| P1 | 数据 Hooks | useBuildings 加载逻辑 |
| P2 | 组件渲染 | DetailPanel 是否正确显示字段 |
| P3 | E2E | 搜索→定位→打开面板完整链路 |

### 6.3 测试文件命名

```
src/utils/geo.ts        → tests/utils/geo.test.ts
src/config/fieldConfig.ts → tests/config/fieldConfig.test.ts
```

---

## 七、CI/CD

### 7.1 CI（每次 PR 触发）

```yaml
# .github/workflows/ci.yml
- TypeScript 类型检查（tsc --noEmit）
- ESLint 代码检查
- Vitest 单元测试
- Vite 构建验证
```

### 7.2 CD（合并到 main 触发）

部署目标选项：

| 方案 | 特点 | 适用场景 |
|------|------|---------|
| GitHub Pages | 免费，零配置 | 演示/展示 |
| Vercel | 自动预览，免费额度 | 开发迭代快 |
| 自有服务器（Nginx） | 完全控制 | 正式上线 |

推荐先用 **GitHub Pages**（零成本），后续可随时切换。

---

## 八、CHANGELOG 格式

```markdown
# Changelog

## [Unreleased]

### Added
- 新增楼层渐变色指示器 (#12)

### Changed
- 优化 DetailPanel 动画曲线

### Fixed
- 修复搜索框在移动端溢出问题

## [0.1.0] - 2026-03-09
### Added
- Phase 1-6 基础功能完成
- 暗色底图 + 3D 建筑渲染
- 悬停 Tooltip + 点击详情面板
- 楼层展开功能
- 中英文搜索
```

---

## 九、后续功能开发路线

### 近期（界面美化）

拆分为独立任务：

| # | 任务 | 范围 | 文件数 |
|---|------|------|--------|
| 1 | 提取主题常量到 theme.ts | config/ | 1 新建 + 4 CSS 引用 |
| 2 | TopBar 独立组件 + 响应式 | layout/ | 2 新建 |
| 3 | DetailPanel 重设计 | panel/ | 2 文件 |
| 4 | SearchBar 重设计 | search/ | 2 文件 |
| 5 | Tooltip 重设计 | map/ | 2 文件 |
| 6 | 地图光照/氛围 | map/ | 1 文件 + mapConfig |
| 7 | 加载态/空态优化 | layout/ | 1-2 文件 |
| 8 | 移动端适配 | 各 CSS | 各 CSS 文件 |

### 中期

- 真实 GeoJSON 数据替换
- 更多建筑的楼层数据
- 碳捕集数据可视化（图表、指标卡片）
- 国际化（i18n）

### 远期

- 后端 API 接入
- 用户认证
- 数据大屏模式

---

## 十、执行顺序

```
Step 1: 创建 CLAUDE.md                    ← 立即
Step 2: 目录结构重组 + 模块 README          ← 立即
Step 3: 初始化 Git 仓库 + 首次提交          ← 立即
Step 4: 推送到 GitHub                      ← 立即
Step 5: 配置 CI（GitHub Actions）           ← 然后
Step 6: 安装 Vitest + 写核心测试            ← 然后
Step 7: 按任务表逐项美化界面                ← 之后
Step 8: 配置自动部署                        ← 需要时
```

Step 1-4 可以现在一次性完成，为后续所有工作打基础。
