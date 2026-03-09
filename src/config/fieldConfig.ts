import type { FieldMeta } from '../types';

// 固定字段（代码强依赖，不在面板中展示）
export const FIXED_FIELDS = new Set(['id', 'height', 'has_floors']);

// 字段配置表：控制显示行为
export const FIELD_CONFIG: Record<string, FieldMeta> = {
  name_zh:      { label: '名称',   showInTooltip: true,  order: 1 },
  name_en:      { label: 'Name',   showInTooltip: true,  order: 2 },
  height:       { label: '楼高',   showInTooltip: true,  order: 3, unit: 'm' },
  category:     { label: '类别',   showInTooltip: false, order: 4 },
  departments:  { label: '部门',   showInTooltip: false, order: 5 },
  description:  { label: '简介',   showInTooltip: false, order: 6 },
};

// 获取排序后的可展示字段
interface DisplayField {
  key: string;
  label: string;
  value: unknown;
  showInTooltip: boolean;
  order: number;
  unit?: string;
}

export function getDisplayFields(properties: Record<string, unknown>): DisplayField[] {
  const configured: DisplayField[] = [];
  const unconfigured: DisplayField[] = [];

  for (const [key, value] of Object.entries(properties)) {
    if (FIXED_FIELDS.has(key)) continue;

    const config = FIELD_CONFIG[key];
    if (config) {
      configured.push({
        key,
        label: config.label,
        value,
        showInTooltip: config.showInTooltip,
        order: config.order,
        unit: config.unit,
      });
    } else {
      unconfigured.push({
        key,
        label: key,
        value,
        showInTooltip: false,
        order: 9999,
      });
    }
  }

  return [...configured.sort((a: DisplayField, b: DisplayField) => a.order - b.order), ...unconfigured];
}
