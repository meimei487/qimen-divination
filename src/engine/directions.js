/**
 * 方位計算 — 月將加時
 * 計算太沖(卯)、小吉(未)、從魁(酉) 在天盤上的落宮
 */

import { ZHI_INDEX, DI_ZHI, ZHI_TO_PALACE, NINE_PALACES } from './constants.js';

/**
 * 十二天將名稱 (簡化版，用於太沖/小吉/從魁)
 */
const TIAN_JIANG = {
  '子': '神后', '丑': '大吉', '寅': '功曹', '卯': '太沖',
  '辰': '天罡', '巳': '太乙', '午': '勝光', '未': '小吉',
  '申': '傳送', '酉': '從魁', '戌': '河魁', '亥': '登明',
};

/**
 * 月將加時旋轉
 * 原理：月將所在的地支 = 天盤上月將地支落在時辰地支的位置
 * 然後其他地支依次順排
 *
 * @param {string} monthGeneral - 月將地支
 * @param {string} hourBranch - 時辰地支
 * @returns {Object[]} - 各地支在天盤上的落宮資訊
 */
export function computeDirections(monthGeneral, hourBranch) {
  const mgIndex = ZHI_INDEX[monthGeneral];
  const hbIndex = ZHI_INDEX[hourBranch];

  // 天盤旋轉: 月將落在時辰位置
  // 對於每個地支 X，其在天盤上的位置 = (X的序號 - 月將序號 + 時辰序號 + 12) % 12
  const results = [];

  for (let i = 0; i < 12; i++) {
    const originalZhi = DI_ZHI[i]; // 地盤上的地支
    const tianpanIndex = ((i - mgIndex + hbIndex) % 12 + 12) % 12;
    const tianpanZhi = DI_ZHI[tianpanIndex]; // 天盤上落在的地支位置
    const palace = ZHI_TO_PALACE[tianpanZhi];

    results.push({
      originalZhi,          // 原始地支
      tianpanPosition: tianpanZhi,  // 天盤落位
      palace,               // 所在宮位
      tianJiang: TIAN_JIANG[originalZhi], // 天將名
    });
  }

  return results;
}

/**
 * 取得太沖(卯)、小吉(未)、從魁(酉) 的避難方位
 * 這三個是「出行避難」的關鍵方位
 *
 * @param {string} monthGeneral - 月將地支
 * @param {string} hourBranch - 時辰地支
 * @returns {{ taiChong: Object, xiaoJi: Object, congKui: Object, allDirections: Object[] }}
 */
export function getEscapeDirections(monthGeneral, hourBranch) {
  const all = computeDirections(monthGeneral, hourBranch);

  const taiChong = all.find(d => d.originalZhi === '卯'); // 太沖
  const xiaoJi = all.find(d => d.originalZhi === '未');   // 小吉
  const congKui = all.find(d => d.originalZhi === '酉');  // 從魁

  // 取得九宮方位名稱
  const getPalaceDirection = (item) => {
    if (!item) return null;
    const palace = NINE_PALACES.find(p => p.name === item.palace);
    return palace ? palace.direction : item.palace;
  };

  return {
    taiChong: {
      ...taiChong,
      direction: getPalaceDirection(taiChong),
      label: '太沖（卯）',
    },
    xiaoJi: {
      ...xiaoJi,
      direction: getPalaceDirection(xiaoJi),
      label: '小吉（未）',
    },
    congKui: {
      ...congKui,
      direction: getPalaceDirection(congKui),
      label: '從魁（酉）',
    },
    allDirections: all,
  };
}
