/**
 * 日時干生剋判斷
 * 根據日干與時干的五行關係，輸出斷語
 */

import { GAN_TO_WUXING, GAN_TO_PALACE, PALACE_WUXING, getWuxingRelation, getBranchRelation } from './constants.js';

/**
 * 判斷日時干支的生剋關係
 * @param {Object} dayPillar - 日柱干支
 * @param {Object} hourPillar - 時柱干支
 */
export function assessPillarInteraction(dayPillar, hourPillar) {
  const dayStem = dayPillar.stem;
  const hourStem = hourPillar.stem;
  const dayWuxing = GAN_TO_WUXING[dayStem];
  const hourWuxing = GAN_TO_WUXING[hourStem];

  const dayPalace = GAN_TO_PALACE[dayStem];
  const hourPalace = GAN_TO_PALACE[hourStem];

  const dayPalaceWx = PALACE_WUXING[dayPalace];
  const hourPalaceWx = PALACE_WUXING[hourPalace];

  // 用宮位的五行來判斷生剋
  const relation = getWuxingRelation(hourPalaceWx, dayPalaceWx);

  let verdict, description, emoji;

  switch (relation) {
    case 'generate':
      verdict = '目標易達成';
      description = `時干${hourStem}所在${hourPalace}（${hourPalaceWx}）生日干${dayStem}所在${dayPalace}（${dayPalaceWx}），外力助我，事半功倍。`;
      emoji = '🟢';
      break;
    case 'generated':
      verdict = '我方需主動付出';
      description = `日干${dayStem}所在${dayPalace}（${dayPalaceWx}）生時干${hourStem}所在${hourPalace}（${hourPalaceWx}），我去求事，需花費精力。`;
      emoji = '🟡';
      break;
    case 'overcome':
      verdict = '阻力較大，宜謹慎';
      description = `時干${hourStem}所在${hourPalace}（${hourPalaceWx}）剋日干${dayStem}所在${dayPalace}（${dayPalaceWx}），外力壓制，宜避讓或另擇時機。`;
      emoji = '🔴';
      break;
    case 'overcomed':
      verdict = '我能把握局面';
      description = `日干${dayStem}所在${dayPalace}（${dayPalaceWx}）剋時干${hourStem}所在${hourPalace}（${hourPalaceWx}），我方佔優，可主導局勢。`;
      emoji = '🔵';
      break;
    case 'same':
      verdict = '平穩，需自身努力';
      description = `日干${dayStem}與時干${hourStem}五行皆為${dayPalaceWx}，比和之象，事在人為。`;
      emoji = '⚪';
      break;
    default:
      verdict = '關係不明';
      description = '無法判斷生剋關係。';
      emoji = '❓';
  }

  // 計算地支關係
  const branchRelation = getBranchRelation(dayPillar.branch, hourPillar.branch);

  return {
    relation,
    verdict,
    description,
    emoji,
    branchRelation,
    dayInfo: {
      stem: dayStem,
      branch: dayPillar.branch,
      wuxing: dayWuxing,
      palace: dayPalace,
      palaceWuxing: dayPalaceWx,
    },
    hourInfo: {
      stem: hourStem,
      branch: hourPillar.branch,
      wuxing: hourWuxing,
      palace: hourPalace,
      palaceWuxing: hourPalaceWx,
    },
  };
}
