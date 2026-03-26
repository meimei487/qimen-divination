/**
 * 九宮格方位圖 SVG 元件
 */

import { NINE_PALACES, ZHI_TO_PALACE } from '../engine/constants.js';

/**
 * 九宮格佈局 (洛書排列):
 *   巽(4) | 離(9) | 坤(2)
 *   震(3) | 中(5) | 兌(7)
 *   艮(8) | 坎(1) | 乾(6)
 */
const GRID_LAYOUT = [
  ['巽宮', '離宮', '坤宮'],
  ['震宮', '中宮', '兌宮'],
  ['艮宮', '坎宮', '乾宮'],
];

const PALACE_DIRECTIONS = {
  '巽宮': '東南', '離宮': '南', '坤宮': '西南',
  '震宮': '東', '中宮': '中', '兌宮': '西',
  '艮宮': '東北', '坎宮': '北', '乾宮': '西北',
};

const PALACE_COLORS = {
  '巽宮': '#22c55e', '離宮': '#ef4444', '坤宮': '#a3763d',
  '震宮': '#22c55e', '中宮': '#a3763d', '兌宮': '#e2e8f0',
  '艮宮': '#a3763d', '坎宮': '#3b82f6', '乾宮': '#e2e8f0',
};

const PALACE_WUXING_LABELS = {
  '巽宮': '木', '離宮': '火', '坤宮': '土',
  '震宮': '木', '中宮': '土', '兌宮': '金',
  '艮宮': '土', '坎宮': '水', '乾宮': '金',
};

export function createNinePalaceGrid(container, escapeData) {
  // escapeData = { taiChong, xiaoJi, congKui, allDirections }
  const highlightPalaces = {};
  if (escapeData) {
    if (escapeData.taiChong) {
      highlightPalaces[escapeData.taiChong.palace] = {
        label: '太沖',
        zhi: '卯',
        class: 'highlight-taichong',
      };
    }
    if (escapeData.xiaoJi) {
      highlightPalaces[escapeData.xiaoJi.palace] = {
        label: '小吉',
        zhi: '未',
        class: 'highlight-xiaoji',
      };
    }
    if (escapeData.congKui) {
      highlightPalaces[escapeData.congKui.palace] = {
        label: '從魁',
        zhi: '酉',
        class: 'highlight-congkui',
      };
    }
  }

  const cellSize = 120;
  const padding = 15;
  const gap = 6;
  const totalSize = cellSize * 3 + gap * 2 + padding * 2;

  let svgContent = `
    <svg viewBox="0 0 ${totalSize} ${totalSize}" xmlns="http://www.w3.org/2000/svg" class="nine-palace-svg" role="img" aria-label="九宮格方位圖">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <filter id="glow-strong">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffd700;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ff8c00;stop-opacity:1" />
        </linearGradient>
      </defs>
  `;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const palace = GRID_LAYOUT[row][col];
      const x = padding + col * (cellSize + gap);
      const y = padding + row * (cellSize + gap);
      const direction = PALACE_DIRECTIONS[palace];
      const wuxing = PALACE_WUXING_LABELS[palace];
      const color = PALACE_COLORS[palace];
      const highlight = highlightPalaces[palace];
      const isHighlighted = !!highlight;

      // 背景矩形
      svgContent += `
        <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="8"
          fill="${isHighlighted ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.05)'}"
          stroke="${isHighlighted ? '#ffd700' : 'rgba(255,255,255,0.1)'}"
          stroke-width="${isHighlighted ? 2.5 : 1}"
          ${isHighlighted ? 'filter="url(#glow)"' : ''}
          class="palace-cell ${isHighlighted ? 'palace-highlighted' : ''}"
        />
      `;

      // 方位名（左上角）
      svgContent += `
        <text x="${x + 10}" y="${y + 20}" fill="rgba(255,255,255,0.5)" font-size="12" font-family="Inter, sans-serif">
          ${direction}
        </text>
      `;

      // 宮名（中央）
      svgContent += `
        <text x="${x + cellSize / 2}" y="${y + cellSize / 2 - 5}" fill="${isHighlighted ? '#ffd700' : 'rgba(255,255,255,0.85)'}"
          font-size="${isHighlighted ? 20 : 17}" font-weight="${isHighlighted ? 'bold' : 'normal'}"
          text-anchor="middle" font-family="'Noto Serif TC', serif"
          ${isHighlighted ? 'filter="url(#glow)"' : ''}>
          ${palace.replace('宮', '')}
        </text>
      `;

      // 五行標籤（右下角）
      svgContent += `
        <text x="${x + cellSize - 12}" y="${y + cellSize - 10}" fill="${color}" font-size="14"
          text-anchor="end" font-family="'Noto Serif TC', serif" opacity="0.7">
          ${wuxing}
        </text>
      `;

      // 高亮標記
      if (isHighlighted) {
        svgContent += `
          <text x="${x + cellSize / 2}" y="${y + cellSize / 2 + 18}" fill="#ffd700"
            font-size="13" text-anchor="middle" font-weight="bold"
            font-family="'Noto Serif TC', serif" filter="url(#glow)">
            ${highlight.label}（${highlight.zhi}）
          </text>
        `;

        // 角落指示三角
        svgContent += `
          <polygon points="${x + cellSize - 20},${y} ${x + cellSize},${y} ${x + cellSize},${y + 20}"
            fill="#ffd700" opacity="0.6"/>
        `;
      }
    }
  }

  // 中間太極圖案（簡化）
  const cx = padding + cellSize + gap + cellSize / 2;
  const cy = padding + cellSize + gap + cellSize / 2;
  if (!highlightPalaces['中宮']) {
    svgContent += `
      <circle cx="${cx}" cy="${cy + 6}" r="18" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
      <path d="M ${cx} ${cy - 12} A 9 9 0 0 1 ${cx} ${cy + 18} A 18 18 0 0 1 ${cx} ${cy - 12}" fill="rgba(255,255,255,0.08)"/>
    `;
  }

  svgContent += '</svg>';

  // 方位說明
  let legendHTML = '';
  if (escapeData) {
    legendHTML = `
      <div class="direction-legend">
        <div class="legend-title">📍 泊地方位</div>
        <div class="legend-items">
          <div class="legend-item taichong">
            <span class="legend-dot"></span>
            <span>太沖（卯）→ ${escapeData.taiChong?.direction || '—'}</span>
          </div>
          <div class="legend-item xiaoji">
            <span class="legend-dot"></span>
            <span>小吉（未）→ ${escapeData.xiaoJi?.direction || '—'}</span>
          </div>
          <div class="legend-item congkui">
            <span class="legend-dot"></span>
            <span>從魁（酉）→ ${escapeData.congKui?.direction || '—'}</span>
          </div>
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="nine-palace-section glass-panel result-area">
      <div class="section-header">
        <span class="section-icon">🧭</span>
        <h2>九宮方位</h2>
      </div>
      <div class="nine-palace-wrapper">
        ${svgContent}
      </div>
      ${legendHTML}
    </div>
  `;

  // 延遲添加可見類
  requestAnimationFrame(() => {
    container.querySelector('.result-area')?.classList.add('visible');
  });
}
