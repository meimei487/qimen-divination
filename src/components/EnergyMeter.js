/**
 * 五行能量儀表盤元件
 */

export function createEnergyMeter(container, energyData) {
  if (!energyData) {
    container.innerHTML = '';
    return;
  }

  const { seasonElement, dayElement, hourElement, overall } = energyData;

  // 構建能量條
  function makeBar(label, element, percent, status) {
    const barColor = getStatusColor(status);
    return `
      <div class="energy-bar-row">
        <div class="energy-label">
          <span class="energy-stem">${element.stem}</span>
          <span class="energy-wuxing" style="color: ${getWuxingColor(element.wuxing)}">${element.wuxing}</span>
          <span class="energy-status" style="color: ${barColor}">${status}</span>
        </div>
        <div class="energy-bar-track">
          <div class="energy-bar-fill" style="width: ${percent}%; background: ${barColor};" data-percent="${percent}">
          </div>
          <span class="energy-bar-value">${percent}%</span>
        </div>
      </div>
    `;
  }

  // 圓形儀表盤
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (overall.percent / 100) * circumference;

  container.innerHTML = `
    <div class="energy-section glass-panel result-area">
      <div class="section-header">
        <span class="section-icon">⚡</span>
        <h2>五行能量</h2>
      </div>

      <div class="energy-season">
        <span class="season-badge" style="color: ${getWuxingColor(seasonElement)}">
          當令 · ${seasonElement}
        </span>
      </div>

      <div class="energy-content">
        <div class="energy-gauge-wrapper">
          <svg viewBox="0 0 120 120" class="energy-gauge">
            <circle cx="60" cy="60" r="54"
              fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8"/>
            <circle cx="60" cy="60" r="54"
              fill="none" stroke="${overall.gradeColor}" stroke-width="8"
              stroke-linecap="round"
              stroke-dasharray="${circumference}"
              stroke-dashoffset="${dashOffset}"
              transform="rotate(-90 60 60)"
              class="gauge-arc"/>
            <text x="60" y="52" text-anchor="middle" fill="${overall.gradeColor}"
              font-size="24" font-weight="bold" font-family="'Noto Serif TC', serif">
              ${overall.percent}%
            </text>
            <text x="60" y="72" text-anchor="middle" fill="${overall.gradeColor}"
              font-size="14" font-family="'Noto Serif TC', serif">
              ${overall.gradeEmoji} ${overall.grade}
            </text>
          </svg>
        </div>

        <div class="energy-bars">
          ${makeBar('日干', dayElement, dayElement.percent, dayElement.label)}
          ${makeBar('時干', hourElement, hourElement.percent, hourElement.label)}
        </div>
      </div>

      <div class="energy-summary">
        <div class="summary-text">
          ${getEnergySummary(dayElement, hourElement, overall, seasonElement)}
        </div>
      </div>
    </div>
  `;

  // 動畫
  requestAnimationFrame(() => {
    const area = container.querySelector('.result-area');
    area?.classList.add('visible');

    // 能量條動畫
    setTimeout(() => {
      container.querySelectorAll('.energy-bar-fill').forEach(bar => {
        const target = bar.dataset.percent;
        bar.style.width = target + '%';
      });
    }, 200);
  });

  // 初始設置能量條為0寬度，然後動畫展開
  container.querySelectorAll('.energy-bar-fill').forEach(bar => {
    bar.style.width = '0%';
  });
}

function getStatusColor(status) {
  const colors = {
    '旺': '#4ade80',
    '相': '#60a5fa',
    '休': '#fbbf24',
    '囚': '#f97316',
    '死': '#ef4444',
  };
  return colors[status] || '#94a3b8';
}

function getWuxingColor(wuxing) {
  const colors = {
    '木': '#22c55e',
    '火': '#ef4444',
    '土': '#d4a147',
    '金': '#e2e8f0',
    '水': '#3b82f6',
  };
  return colors[wuxing] || '#94a3b8';
}

function getEnergySummary(day, hour, overall, seasonEl) {
  if (overall.percent >= 80) {
    return `${seasonEl}當令，日干${day.stem}（${day.wuxing}）${day.label}、時干${hour.stem}（${hour.wuxing}）${hour.label}。整體能量充沛，事主之力強盛，大利行事。`;
  } else if (overall.percent >= 60) {
    return `${seasonEl}當令，日干${day.label}、時干${hour.label}。能量尚可，宜把握時機，主動出擊為佳。`;
  } else if (overall.percent >= 40) {
    return `${seasonEl}當令，日干${day.label}、時干${hour.label}。能量平平，事在人為，需多加努力。`;
  } else if (overall.percent >= 25) {
    return `${seasonEl}當令，日干${day.label}、時干${hour.label}。能量偏弱，行事宜保守，不宜冒進。`;
  } else {
    return `${seasonEl}當令，日干${day.label}、時干${hour.label}。能量極弱，此時不宜行大事，宜靜待時機。`;
  }
}
