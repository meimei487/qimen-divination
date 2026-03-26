/**
 * 節氣 / 中氣判別
 * 提供 2024-2030 年各中氣的精確日期 (公曆)
 * 用於判斷月將是否已切換
 */

// 每年的中氣日期表 (格式: [月, 日])
// 中氣順序: 雨水(正月)、春分(二月)、穀雨(三月)、小滿(四月)、夏至(五月)、
//           大暑(六月)、處暑(七月)、秋分(八月)、霜降(九月)、小雪(十月)、
//           冬至(十一月)、大寒(十二月)
const ZHONGQI_DATA = {
  2024: [
    [2, 19],  // 雨水
    [3, 20],  // 春分
    [4, 19],  // 穀雨
    [5, 20],  // 小滿
    [6, 21],  // 夏至
    [7, 22],  // 大暑
    [8, 22],  // 處暑
    [9, 22],  // 秋分
    [10, 23], // 霜降
    [11, 22], // 小雪
    [12, 21], // 冬至
    [1, 20],  // 大寒 (次年1月，但屬本年十二月)
  ],
  2025: [
    [2, 18],  // 雨水
    [3, 20],  // 春分
    [4, 20],  // 穀雨
    [5, 21],  // 小滿
    [6, 21],  // 夏至
    [7, 22],  // 大暑
    [8, 23],  // 處暑
    [9, 23],  // 秋分
    [10, 23], // 霜降
    [11, 22], // 小雪
    [12, 22], // 冬至
    [1, 20],  // 大寒
  ],
  2026: [
    [2, 18],  // 雨水
    [3, 20],  // 春分
    [4, 20],  // 穀雨
    [5, 21],  // 小滿
    [6, 21],  // 夏至
    [7, 23],  // 大暑
    [8, 23],  // 處暑
    [9, 23],  // 秋分
    [10, 23], // 霜降
    [11, 22], // 小雪
    [12, 22], // 冬至
    [1, 20],  // 大寒
  ],
  2027: [
    [2, 19],  // 雨水
    [3, 21],  // 春分
    [4, 20],  // 穀雨
    [5, 21],  // 小滿
    [6, 21],  // 夏至
    [7, 23],  // 大暑
    [8, 23],  // 處暑
    [9, 23],  // 秋分
    [10, 24], // 霜降
    [11, 22], // 小雪
    [12, 22], // 冬至
    [1, 20],  // 大寒
  ],
  2028: [
    [2, 19],  // 雨水
    [3, 20],  // 春分
    [4, 19],  // 穀雨
    [5, 20],  // 小滿
    [6, 21],  // 夏至
    [7, 22],  // 大暑
    [8, 22],  // 處暑
    [9, 22],  // 秋分
    [10, 23], // 霜降
    [11, 21], // 小雪
    [12, 21], // 冬至
    [1, 20],  // 大寒
  ],
  2029: [
    [2, 18],  // 雨水
    [3, 20],  // 春分
    [4, 20],  // 穀雨
    [5, 21],  // 小滿
    [6, 21],  // 夏至
    [7, 22],  // 大暑
    [8, 23],  // 處暑
    [9, 22],  // 秋分
    [10, 23], // 霜降
    [11, 22], // 小雪
    [12, 21], // 冬至
    [1, 20],  // 大寒
  ],
  2030: [
    [2, 18],  // 雨水
    [3, 20],  // 春分
    [4, 20],  // 穀雨
    [5, 21],  // 小滿
    [6, 21],  // 夏至
    [7, 23],  // 大暑
    [8, 23],  // 處暑
    [9, 23],  // 秋分
    [10, 23], // 霜降
    [11, 22], // 小雪
    [12, 22], // 冬至
    [1, 20],  // 大寒
  ],
};

// 中氣名稱
const ZHONGQI_NAMES = [
  '雨水', '春分', '穀雨', '小滿', '夏至',
  '大暑', '處暑', '秋分', '霜降', '小雪',
  '冬至', '大寒',
];

/**
 * 判斷指定日期是否已過該農曆月份的中氣
 * @param {Date} date - 公曆日期
 * @returns {{ lunarMonth: number, afterZhongqi: boolean, zhongqiName: string }}
 */
export function getZhongqiInfo(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  const yearData = ZHONGQI_DATA[year];
  if (!yearData) {
    // 超出範圍，使用近似算法
    return getApproximateZhongqi(date);
  }

  // 找出當前日期處於哪兩個中氣之間
  // 中氣索引 0=雨水(正月), 1=春分(二月), ..., 11=大寒(十二月)
  for (let i = 0; i < 12; i++) {
    const [zqMonth, zqDay] = yearData[i];
    const zqDate = new Date(year, zqMonth - 1, zqDay);

    // 大寒特殊處理 (跨年)
    if (i === 11 && zqMonth === 1) {
      // 大寒在次年1月，這裡的 yearData 記錄的是次年1月
      const nextYearZq = new Date(year + 1, 0, zqDay);
      // 如果當前日期在冬至之後且在次年大寒之前
      const dongzhiData = yearData[10]; // 冬至
      const dongzhiDate = new Date(year, dongzhiData[0] - 1, dongzhiData[1]);

      if (date >= dongzhiDate && month === 12) {
        // 冬至後、年末 → 農曆十一月，已過冬至
        return { lunarMonth: 11, afterZhongqi: true, zhongqiName: '冬至' };
      }
      if (month === 1 && day < zqDay) {
        // 新年1月，大寒之前 → 仍屬十二月，未過大寒
        return { lunarMonth: 12, afterZhongqi: false, zhongqiName: '大寒' };
      }
      if (month === 1 && day >= zqDay) {
        // 新年1月，大寒之後 → 十二月，已過大寒
        return { lunarMonth: 12, afterZhongqi: true, zhongqiName: '大寒' };
      }
      continue;
    }

    if (month === zqMonth && day >= zqDay) {
      // 已過此中氣
      // 檢查是否在下一個中氣之前
      const nextI = i + 1;
      if (nextI < 12) {
        const [nextZqMonth, nextZqDay] = yearData[nextI];
        if (month < nextZqMonth || (month === nextZqMonth && day < nextZqDay)) {
          return {
            lunarMonth: i + 1,
            afterZhongqi: true,
            zhongqiName: ZHONGQI_NAMES[i],
          };
        }
      }
    }
  }

  // 嘗試找出位置
  // 從後往前找最後一個已過的中氣
  for (let i = 11; i >= 0; i--) {
    const [zqMonth, zqDay] = yearData[i];
    if (i === 11 && zqMonth === 1) continue; // 跳過大寒（跨年）

    if (month > zqMonth || (month === zqMonth && day >= zqDay)) {
      return {
        lunarMonth: i + 1,
        afterZhongqi: true,
        zhongqiName: ZHONGQI_NAMES[i],
      };
    }
  }

  // 1月份、雨水之前 → 可能是上年度大寒後的十二月
  // 檢查上一年的大寒
  const prevYearData = ZHONGQI_DATA[year - 1];
  if (prevYearData) {
    const dahanData = prevYearData[11]; // 大寒
    if (dahanData[0] === 1) {
      if (month === 1 && day >= dahanData[1]) {
        return { lunarMonth: 12, afterZhongqi: true, zhongqiName: '大寒' };
      }
    }
  }

  // 1月、雨水之前、大寒也未過 → 十二月，未過大寒
  return { lunarMonth: 12, afterZhongqi: false, zhongqiName: '大寒' };
}

/**
 * 近似中氣判斷（無精確數據時的備用）
 */
function getApproximateZhongqi(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 近似中氣日期 (每月約20日)
  const approxDays = [19, 20, 20, 21, 21, 22, 23, 23, 23, 23, 22, 21];
  const zhongqiIndex = month - 2 < 0 ? 11 : month - 2;
  const approxDay = approxDays[zhongqiIndex] || 20;

  if (month === 1) {
    // 1月：大寒約1/20
    return {
      lunarMonth: 12,
      afterZhongqi: day >= 20,
      zhongqiName: '大寒',
    };
  }

  // 對應表：公曆月份 → 農曆月份 (中氣後)
  const monthMap = {
    2: 1,   // 2月雨水後→正月
    3: 2,   // 3月春分後→二月
    4: 3,   // 4月穀雨後→三月
    5: 4,   // 5月小滿後→四月
    6: 5,   // 6月夏至後→五月
    7: 6,   // 7月大暑後→六月
    8: 7,   // 8月處暑後→七月
    9: 8,   // 9月秋分後→八月
    10: 9,  // 10月霜降後→九月
    11: 10, // 11月小雪後→十月
    12: 11, // 12月冬至後→十一月
  };

  const lunarMonth = monthMap[month] || 1;
  const afterZhongqi = day >= approxDay;

  return {
    lunarMonth: afterZhongqi ? lunarMonth : (lunarMonth === 1 ? 12 : lunarMonth - 1),
    afterZhongqi,
    zhongqiName: ZHONGQI_NAMES[lunarMonth - 1] || '雨水',
  };
}
