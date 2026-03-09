// 主题色常量 — 所有组件引用这里的值
// 修改主题只需改这个文件

export const THEME = {
  // 背景
  bgPrimary: 'rgba(14, 14, 24, 0.94)',
  bgOverlay: 'rgba(16, 16, 26, 0.92)',
  bgPage: '#0a0a14',

  // 文字
  textPrimary: '#f0f0f0',
  textSecondary: '#e0e0e0',
  textMuted: '#8a8a9a',
  textDim: '#6a6a7a',
  textDisabled: '#555',

  // 强调色
  accent: '#00c8b4',
  accentLight: '#00e6cc',
  accentDim: 'rgba(0, 200, 180, 0.15)',

  // 选中色
  selected: '#ffc800',
  selectedDim: 'rgba(255, 200, 0, 0.15)',

  // 边框
  borderSubtle: 'rgba(255, 255, 255, 0.06)',
  borderAccent: 'rgba(0, 200, 180, 0.2)',

  // 类别徽章
  categoryAcademic: { bg: 'rgba(66, 133, 244, 0.15)', text: '#6ea8fe', border: 'rgba(66, 133, 244, 0.2)' },
  categoryResidential: { bg: 'rgba(180, 120, 255, 0.15)', text: '#c49dff', border: 'rgba(180, 120, 255, 0.2)' },
  categoryFacility: { bg: 'rgba(0, 200, 180, 0.15)', text: '#00d4be', border: 'rgba(0, 200, 180, 0.2)' },
  categoryAdministrative: { bg: 'rgba(255, 180, 50, 0.15)', text: '#ffc85c', border: 'rgba(255, 180, 50, 0.2)' },

  // 圆角
  radiusSm: '6px',
  radiusMd: '8px',
  radiusLg: '10px',

  // 阴影
  shadowMd: '0 4px 20px rgba(0, 0, 0, 0.4)',
  shadowLg: '0 8px 32px rgba(0, 0, 0, 0.35)',

  // 动画
  transitionFast: '0.15s ease-out',
  transitionNormal: '0.25s ease',
} as const
