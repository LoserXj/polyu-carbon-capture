# search/ — 搜索模块

## 组件

### SearchBar.tsx
顶部搜索框 + 下拉建议列表。

**功能**:
- 中英文模糊搜索（name_zh / name_en / id）
- 实时过滤，最多 8 条结果
- 键盘操作：上下选择、Enter 确认、Escape 关闭
- 选中后触发 onSelect → 父组件执行 FlyTo + 打开面板

**Props**: buildings (BuildingProperties[]), onSelect
