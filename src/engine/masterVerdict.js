import { ZHI_TO_PALACE, PALACE_DIRECTIONS } from './constants.js';

/**
 * 根據所有算出的盤面資料，生成一段大師建言
 */
export function generateMasterVerdict(
  stemInteraction,
  energyResult,
  advancedData,
  escapeDirections
) {
  let title = '';
  let color = '#fff';
  let lines = [];

  const { relation, verdict, branchRelation, dayInfo } = stemInteraction;
  const { isJieLu, kongWang, noblemen } = advancedData;
  const isDayKongWang = kongWang.includes(dayInfo.branch) || kongWang.includes(dayInfo.stem); // 嚴格來說只需判斷日干落宮
  const dayPalace = dayInfo.palace;
  const isDayPalaceVoid = kongWang.some(z => ZHI_TO_PALACE[z] === dayPalace);

  // 1. 致命警告 (截路空亡最高優先權)
  if (isJieLu) {
    title = '⛔ 諸事不宜，切勿妄動';
    color = '#f87171';
    lines.push('當前時辰逢「截路空亡」，時間磁場斷裂。表面機會恐為虛象，此時起行、周旋皆易成空或橫生枝節，【強烈建議暫緩行動，另擇吉時】。');
  } else if (isDayPalaceVoid) {
    title = '⚠️ 氣場耗弱，不可逞強';
    color = '#fbbf24';
    lines.push('自身（日干）落入「空亡」宮位，代表你目前狀態可能不佳、資源難以到位或判斷易失誤。凡事宜守不宜攻，避免輕易承諾。');
  } else {
    // 沒有致命時間陷阱，看生剋與能量
    // 簡單判斷吉凶
    if (relation === 'generate' || relation === 'overcomed') {
      title = '🌟 掌握主動，順勢而為';
      color = '#4ade80';
      lines.push(`大局${verdict}。時機對你相對有利，可以主導局勢。`);
    } else if (relation === 'overcome') {
      title = '⚠️ 阻力重重，步步為營';
      color = '#f87171';
      lines.push(`大局${verdict}。外部環境或對方帶來較大壓力，需謹慎應對，不宜硬碰硬。`);
    } else {
      title = '⚖️ 局勢平穩，事在人為';
      color = '#60a5fa';
      lines.push(`目前局勢${verdict}。結果取決於個人的努力與後續操作。`);
    }
    
    // 檢查外合內沖/外生內害
    if (branchRelation) {
      if (branchRelation.type === 'liuchong') {
        lines.push('【注意！】這是一個「表面平靜、暗流洶湧」的局，地支相沖代表內部利益衝突嚴重，隨時有生變或翻臉的危險，必須提防破局。');
        title = '🚨 表面無恙，暗藏危機';
        color = '#ef4444';
      } else if (branchRelation.type === 'liuhai' || branchRelation.type === 'xing') {
        lines.push(`需防範地支${branchRelation.label}帶來的負面影響，小心身邊有人暗中阻撓或口舌是非。`);
      } else if (branchRelation.type === 'liuhe') {
        lines.push('且地支六合，事情比表面看起來更穩固，私底下有共同利益或貴人暗盤推動，成功率大增！');
      }
    }
  }

  // 2. 尋找最佳突破口/避難所
  // 找出三個泊地方位中，哪一個沒有落入空亡，且最好有貴人
  let bestEscape = null;
  let backupEscape = null;
  const escapes = [];
  if (escapeDirections.taiChong) escapes.push({ name: '太沖', zhi: '卯', palace: escapeDirections.taiChong.palace });
  if (escapeDirections.xiaoJi) escapes.push({ name: '小吉', zhi: '未', palace: escapeDirections.xiaoJi.palace });
  if (escapeDirections.congKui) escapes.push({ name: '從魁', zhi: '酉', palace: escapeDirections.congKui.palace });

  escapes.forEach(es => {
    const isVoid = kongWang.some(z => ZHI_TO_PALACE[z] === es.palace);
    const hasNoble = noblemen.some(z => ZHI_TO_PALACE[z] === es.palace);
    if (!isVoid) {
      if (hasNoble) {
        bestEscape = es;
      } else if (!backupEscape) {
        backupEscape = es;
      }
    }
  });

  const chosenEscape = bestEscape || backupEscape;
  
  if (chosenEscape) {
    const isNoble = bestEscape ? true : false;
    const dirName = PALACE_DIRECTIONS[chosenEscape.palace];
    lines.push(`👉 **突圍方位**：若遇不順或急需尋找出口，請立刻往**【${dirName}方 (${chosenEscape.palace})】**行動或尋求支援。那裡是安全的${chosenEscape.name}吉方${isNoble ? '，且帶有天乙貴人相助，最能逢凶化吉！' : '，能避開當前凶波。'}`);
  } else {
    lines.push('👉 **突圍方位**：目前所有吉方皆被空亡覆蓋，猶如求救無門。請盡可能按兵不動，靜待時機轉變。');
  }

  return { title, color, lines };
}
