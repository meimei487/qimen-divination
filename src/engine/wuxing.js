/**
 * 五行旺衰計算
 * 當令(旺)+1、相0、休-1、囚-2、死-3
 */

import { WU_XING, GENERATES, OVERCOMES, GAN_TO_WUXING } from './constants.js';

/**
 * 根據月份判斷當令五行
 * 春(寅卯辰月/2-4月)→木旺
 * 夏(巳午未月/5-7月)→火旺
 * 秋(申酉戌月/8-10月)→金旺
 * 冬(亥子丑月/11-1月)→水旺
 * 四季末(辰未戌丑月)→土旺
 *
 * @param {number} lunarMonth - 農曆月份 (1-12)
 * @returns {string} 當令五行
 */
export function getSeasonElement(lunarMonth) {
  // 簡化: 以農曆月份為準
  // 正月(1)寅月-三月(3)辰月 → 春 → 木
  // 四月(4)巳月-六月(6)未月 → 夏 → 火
  // 七月(7)申月-九月(9)戌月 → 秋 → 金
  // 十月(10)亥月-十二月(12)丑月 → 冬 → 水
  if (lunarMonth >= 1 && lunarMonth <= 3) return '木';
  if (lunarMonth >= 4 && lunarMonth <= 6) return '火';
  if (lunarMonth >= 7 && lunarMonth <= 9) return '金';
  return '水'; // 10, 11, 12
}

/**
 * 計算某五行在當令下的旺衰狀態
 *
 * 五行旺衰原則:
 * - 旺: 五行當令 → +1
 * - 相: 當令所生 → 0
 * - 休: 生當令者 → -1
 * - 囚: 剋當令者 → -2
 * - 死: 當令所剋 → -3
 *
 * @param {string} element - 待評估的五行
 * @param {string} seasonElement - 當令五行
 * @returns {{ status: string, value: number, label: string }}
 */
export function getElementStatus(element, seasonElement) {
  if (element === seasonElement) {
    return { status: 'wang', value: 1, label: '旺' };
  }

  // 相: 當令所生的 (seasonElement 生 element)
  if (GENERATES[seasonElement] === element) {
    return { status: 'xiang', value: 0, label: '相' };
  }

  // 休: 生當令者 (element 生 seasonElement)
  if (GENERATES[element] === seasonElement) {
    return { status: 'xiu', value: -1, label: '休' };
  }

  // 囚: 剋當令者 (element 剋 seasonElement)
  if (OVERCOMES[element] === seasonElement) {
    return { status: 'qiu', value: -2, label: '囚' };
  }

  // 死: 當令所剋 (seasonElement 剋 element)
  if (OVERCOMES[seasonElement] === element) {
    return { status: 'si', value: -3, label: '死' };
  }

  return { status: 'unknown', value: 0, label: '不明' };
}

/**
 * 綜合能量評估
 * 評估日干、時干與用神(吉門)的五行在當前季節的能量
 *
 * @param {string} dayStem - 日干
 * @param {string} hourStem - 時干
 * @param {number} lunarMonth - 農曆月份
 * @returns {Object} 綜合能量評估結果
 */
export function evaluateEnergy(dayStem, hourStem, lunarMonth) {
  const seasonElement = getSeasonElement(lunarMonth);
  const dayWuxing = GAN_TO_WUXING[dayStem];
  const hourWuxing = GAN_TO_WUXING[hourStem];

  const dayStatus = getElementStatus(dayWuxing, seasonElement);
  const hourStatus = getElementStatus(hourWuxing, seasonElement);

  // 綜合評分 (-3 到 +1 範圍內的平均)
  const avgScore = (dayStatus.value + hourStatus.value) / 2;

  // 轉換為成功概率 (0-100%)
  // -3 → 10%, -2 → 25%, -1 → 45%, 0 → 65%, +1 → 90%
  const scoreToPercent = (v) => {
    const map = { 1: 90, 0: 65, '-1': 45, '-2': 25, '-3': 10 };
    return map[v] || 50;
  };

  const dayPercent = scoreToPercent(dayStatus.value);
  const hourPercent = scoreToPercent(hourStatus.value);
  const overallPercent = Math.round((dayPercent + hourPercent) / 2);

  // 評級
  let grade, gradeColor, gradeEmoji;
  if (overallPercent >= 80) { grade = '大吉'; gradeColor = '#4ade80'; gradeEmoji = '🌟'; }
  else if (overallPercent >= 60) { grade = '吉'; gradeColor = '#60a5fa'; gradeEmoji = '✨'; }
  else if (overallPercent >= 40) { grade = '平'; gradeColor = '#fbbf24'; gradeEmoji = '⚖️'; }
  else if (overallPercent >= 25) { grade = '凶'; gradeColor = '#f97316'; gradeEmoji = '⚠️'; }
  else { grade = '大凶'; gradeColor = '#ef4444'; gradeEmoji = '🚫'; }

  return {
    seasonElement,
    seasonLabel: `當令五行：${seasonElement}`,
    dayElement: {
      wuxing: dayWuxing,
      stem: dayStem,
      ...dayStatus,
      percent: dayPercent,
    },
    hourElement: {
      wuxing: hourWuxing,
      stem: hourStem,
      ...hourStatus,
      percent: hourPercent,
    },
    overall: {
      percent: overallPercent,
      grade,
      gradeColor,
      gradeEmoji,
      avgScore,
    },
  };
}
