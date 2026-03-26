/**
 * 四柱干支計算
 * 從公曆日期計算年柱、月柱、日柱、時柱
 */

import { TIAN_GAN, DI_ZHI, hourToBranch, GAN_INDEX, ZHI_INDEX } from './constants.js';

/**
 * 計算儒略日數 (JDN)
 * @param {number} year
 * @param {number} month (1-12)
 * @param {number} day
 * @returns {number}
 */
function julianDayNumber(year, month, day) {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

/**
 * 計算年柱
 * 以立春為年分界 (簡化：約2月4日)
 * @param {Date} date
 * @returns {{ stem: string, branch: string }}
 */
function getYearPillar(date) {
  let year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 立春前算上一年 (近似以2月4日為界)
  if (month < 2 || (month === 2 && day < 4)) {
    year -= 1;
  }

  // 天干 = (年 - 4) % 10  → 甲=0
  const ganIndex = ((year - 4) % 10 + 10) % 10;
  // 地支 = (年 - 4) % 12  → 子=0
  const zhiIndex = ((year - 4) % 12 + 12) % 12;

  return { stem: TIAN_GAN[ganIndex], branch: DI_ZHI[zhiIndex] };
}

/**
 * 計算月柱
 * 月柱天干依年干推算：年干 × 2 + 月支序號
 * @param {Date} date
 * @param {string} yearStem - 年干
 * @returns {{ stem: string, branch: string }}
 */
function getMonthPillar(date, yearStem) {
  let month = date.getMonth() + 1;
  const day = date.getDate();

  // 節氣分月 (近似：每月5日左右為交節)
  // 寅月(1) 從立春開始(約2/4)
  // 這裡使用簡化算法
  const jieqiDays = [0, 6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7];

  let lunarMonth;
  if (month === 1 || (month === 2 && day < 4)) {
    lunarMonth = 12; // 丑月
  } else {
    // 判斷是否已過當月節氣
    const jieDay = jieqiDays[month] || 6;
    if (day >= jieDay) {
      lunarMonth = month - 1; // 已過節轉入新月
    } else {
      lunarMonth = month - 2;
      if (lunarMonth <= 0) lunarMonth += 12;
    }
  }

  // 月支: 正月=寅(2), 二月=卯(3)...
  const zhiIndex = (lunarMonth + 1) % 12;
  const branch = DI_ZHI[zhiIndex];

  // 月干推算: 甲己之年丙作首
  const yearGanIndex = GAN_INDEX[yearStem];
  const baseGan = [2, 4, 6, 8, 0, 2, 4, 6, 8, 0]; // 年干對應正月起始天干索引
  const monthGanIndex = (baseGan[yearGanIndex] + lunarMonth - 1) % 10;
  const stem = TIAN_GAN[monthGanIndex];

  return { stem, branch };
}

/**
 * 計算日柱
 * 使用儒略日計算
 * @param {Date} date
 * @returns {{ stem: string, branch: string }}
 */
function getDayPillar(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jdn = julianDayNumber(year, month, day);

  // 日干 = (JDN + 9) % 10  (甲子日 JDN 的校正)
  // 基準: 2000年1月7日 = 甲子日, JDN = 2451551
  const baseJDN = 2451551; // 2000-01-07 甲子日
  const diff = Math.round(jdn - baseJDN);

  const ganIndex = ((diff % 10) + 10) % 10;
  const zhiIndex = ((diff % 12) + 12) % 12;

  return { stem: TIAN_GAN[ganIndex], branch: DI_ZHI[zhiIndex] };
}

/**
 * 計算時柱
 * @param {Date} date
 * @param {string} dayStem - 日干
 * @returns {{ stem: string, branch: string }}
 */
function getHourPillar(date, dayStem) {
  const hour = date.getHours();
  const branch = hourToBranch(hour);
  const zhiIndex = ZHI_INDEX[branch];

  // 時干推算: 甲己日甲子起
  const dayGanIndex = GAN_INDEX[dayStem];
  const baseHourGan = [0, 2, 4, 6, 8, 0, 2, 4, 6, 8]; // 日干對應子時起始天干
  const hourGanIndex = (baseHourGan[dayGanIndex] + zhiIndex) % 10;
  const stem = TIAN_GAN[hourGanIndex];

  return { stem, branch };
}

/**
 * 計算完整四柱
 * @param {Date} date
 * @returns {{ year: {stem, branch}, month: {stem, branch}, day: {stem, branch}, hour: {stem, branch} }}
 */
export function getFourPillars(date) {
  const year = getYearPillar(date);
  const month = getMonthPillar(date, year.stem);
  const day = getDayPillar(date);
  const hour = getHourPillar(date, day.stem);

  return { year, month, day, hour };
}
