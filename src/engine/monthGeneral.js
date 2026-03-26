/**
 * 月將計算
 * 根據日期判斷當前月將地支
 */

import { MONTH_GENERAL_MAP } from './constants.js';
import { getZhongqiInfo } from './solarTerms.js';

/**
 * 計算月將
 * @param {Date} date - 公曆日期
 * @returns {{ monthGeneral: string, lunarMonth: number, afterZhongqi: boolean, zhongqiName: string }}
 */
export function getMonthGeneral(date) {
  const info = getZhongqiInfo(date);
  const { lunarMonth, afterZhongqi } = info;

  let effectiveMonth;
  if (afterZhongqi) {
    effectiveMonth = lunarMonth;
  } else {
    // 未過中氣，取上一個月的月將
    effectiveMonth = lunarMonth - 1;
    if (effectiveMonth <= 0) effectiveMonth = 12;
  }

  const monthGeneral = MONTH_GENERAL_MAP[effectiveMonth];

  return {
    monthGeneral,
    lunarMonth: effectiveMonth,
    afterZhongqi,
    zhongqiName: info.zhongqiName,
  };
}
