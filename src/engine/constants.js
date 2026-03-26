/**
 * 奇門遁甲常量定義
 * 天干、地支、五行、九宮方位、映射關係
 */

// 十天干
export const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 十二地支
export const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行
export const WU_XING = ['木', '火', '土', '金', '水'];

// 天干→五行
export const GAN_TO_WUXING = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

// 地支→五行
export const ZHI_TO_WUXING = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

// 地支序號
export const ZHI_INDEX = {};
DI_ZHI.forEach((z, i) => ZHI_INDEX[z] = i);

// 天干序號
export const GAN_INDEX = {};
TIAN_GAN.forEach((g, i) => GAN_INDEX[g] = i);

// 五行生剋關係
// generates[A] = A 所生的五行
export const GENERATES = {
  '木': '火', '火': '土', '土': '金', '金': '水', '水': '木',
};

// overcomes[A] = A 所剋的五行
export const OVERCOMES = {
  '木': '土', '火': '金', '土': '水', '金': '木', '水': '火',
};

// 五行關係判斷函式
export function getWuxingRelation(from, to) {
  if (from === to) return 'same';        // 比和
  if (GENERATES[from] === to) return 'generate';  // 我生
  if (GENERATES[to] === from) return 'generated'; // 生我
  if (OVERCOMES[from] === to) return 'overcome';  // 我剋
  if (OVERCOMES[to] === from) return 'overcomed';  // 剋我
  return 'unknown';
}

// 九宮名稱與方位
export const NINE_PALACES = [
  { name: '巽宮', direction: '東南', index: 0 },
  { name: '離宮', direction: '南',   index: 1 },
  { name: '坤宮', direction: '西南', index: 2 },
  { name: '震宮', direction: '東',   index: 3 },
  { name: '中宮', direction: '中',   index: 4 },
  { name: '兌宮', direction: '西',   index: 5 },
  { name: '艮宮', direction: '東北', index: 6 },
  { name: '坎宮', direction: '北',   index: 7 },
  { name: '乾宮', direction: '西北', index: 8 },
];

// 地支→九宮方位映射 (洛書九宮)
export const ZHI_TO_PALACE = {
  '子': '坎宮',
  '丑': '艮宮', '寅': '艮宮',
  '卯': '震宮',
  '辰': '巽宮', '巳': '巽宮',
  '午': '離宮',
  '未': '坤宮', '申': '坤宮',
  '酉': '兌宮',
  '戌': '乾宮', '亥': '乾宮',
};

// 九宮→五行
export const PALACE_WUXING = {
  '坎宮': '水',
  '艮宮': '土',
  '震宮': '木',
  '巽宮': '木',
  '中宮': '土',
  '兌宮': '金',
  '乾宮': '金',
  '離宮': '火',
  '坤宮': '土',
};

// 天干→九宮 (天干寄宮)
export const GAN_TO_PALACE = {
  '甲': '震宮',  // 甲寄震（甲木）
  '乙': '巽宮',  // 乙寄巽
  '丙': '離宮',  // 丙寄離
  '丁': '離宮',  // 丁寄離
  '戊': '坤宮',  // 戊寄坤（一說中宮）
  '己': '艮宮',  // 己寄艮
  '庚': '兌宮',  // 庚寄兌
  '辛': '乾宮',  // 辛寄乾
  '壬': '坎宮',  // 壬寄坎
  '癸': '坎宮',  // 癸寄坎
};

// 月將對照表 (月份 → 月將地支)
// 正月(雨水後)→亥, 二月(春分後)→戌, ...
export const MONTH_GENERAL_MAP = {
  1: '亥', 2: '戌', 3: '酉', 4: '申',
  5: '未', 6: '午', 7: '巳', 8: '辰',
  9: '卯', 10: '寅', 11: '丑', 12: '子',
};

// 時辰地支對照 (小時 → 地支)
export function hourToBranch(hour) {
  const map = [
    [23, 1, '子'], [1, 3, '丑'], [3, 5, '寅'], [5, 7, '卯'],
    [7, 9, '辰'], [9, 11, '巳'], [11, 13, '午'], [13, 15, '未'],
    [15, 17, '申'], [17, 19, '酉'], [19, 21, '戌'], [21, 23, '亥'],
  ];
  if (hour >= 23 || hour < 1) return '子';
  for (const [start, end, branch] of map) {
    if (hour >= start && hour < end) return branch;
  }
  return '子';
}

// 時辰名稱
export const SHICHEN_NAMES = {
  '子': '子時 (23:00-00:59)',
  '丑': '丑時 (01:00-02:59)',
  '寅': '寅時 (03:00-04:59)',
  '卯': '卯時 (05:00-06:59)',
  '辰': '辰時 (07:00-08:59)',
  '巳': '巳時 (09:00-10:59)',
  '午': '午時 (11:00-12:59)',
  '未': '未時 (13:00-14:59)',
  '申': '申時 (15:00-16:59)',
  '酉': '酉時 (17:00-18:59)',
  '戌': '戌時 (19:00-20:59)',
  '亥': '亥時 (21:00-22:59)',
};
