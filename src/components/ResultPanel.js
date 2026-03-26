/**
 * 結果面板 — 四柱資訊 + 月將資訊 + 綜合結果
 */

import { SHICHEN_NAMES } from '../engine/constants.js';

export function createResultPanel(container, data) {
  if (!data) {
    container.innerHTML = '';
    return;
  }

  const { fourPillars, monthGeneralInfo, date } = data;
  const hourBranch = fourPillars.hour.branch;
  const shichenName = SHICHEN_NAMES[hourBranch] || hourBranch;

  // 農曆月份中文
  const lunarMonthNames = ['', '正月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '冬月', '臘月'];
  const lunarMonthStr = lunarMonthNames[monthGeneralInfo.lunarMonth] || `第${monthGeneralInfo.lunarMonth}月`;

  container.innerHTML = `
    <div class="result-panel glass-panel result-area">
      <div class="section-header">
        <span class="section-icon">📜</span>
        <h2>詳細資訊</h2>
      </div>

      <!-- 四柱 -->
      <div class="four-pillars-display">
        <div class="pillars-title">四柱干支</div>
        <div class="pillars-row">
          ${makePillarCard('年柱', fourPillars.year)}
          ${makePillarCard('月柱', fourPillars.month)}
          ${makePillarCard('日柱', fourPillars.day)}
          ${makePillarCard('時柱', fourPillars.hour)}
        </div>
      </div>

      <!-- 月將與時辰 -->
      <div class="meta-info-grid">
        <div class="meta-card">
          <div class="meta-label">月將</div>
          <div class="meta-value">${monthGeneralInfo.monthGeneral}</div>
          <div class="meta-sub">${lunarMonthStr}${monthGeneralInfo.afterZhongqi ? '（' + monthGeneralInfo.zhongqiName + '後）' : '（' + monthGeneralInfo.zhongqiName + '前）'}</div>
        </div>
        <div class="meta-card">
          <div class="meta-label">時辰</div>
          <div class="meta-value">${hourBranch}</div>
          <div class="meta-sub">${shichenName}</div>
        </div>
        <div class="meta-card">
          <div class="meta-label">公曆</div>
          <div class="meta-value date-small">${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}</div>
          <div class="meta-sub">${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}</div>
        </div>
      </div>

      <!-- 古籍引用 -->
      <div class="quote-box">
        <div class="quote-icon">📖</div>
        <blockquote>
          「出行避難出天門，月將加時順轉輪，卯未酉宮為泊地。」
          <cite>—《聖靈經》</cite>
        </blockquote>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    container.querySelector('.result-area')?.classList.add('visible');
  });
}

function makePillarCard(label, pillar) {
  return `
    <div class="pillar-card">
      <div class="pillar-card-label">${label}</div>
      <div class="pillar-card-stem">${pillar.stem}</div>
      <div class="pillar-card-branch">${pillar.branch}</div>
    </div>
  `;
}
