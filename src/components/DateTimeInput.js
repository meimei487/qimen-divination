/**
 * 日期時間輸入元件
 */

export function createDateTimeInput(container, onChange) {
  const now = new Date();
  const tzOffset = -now.getTimezoneOffset() / 60;
  const tzString = `GMT${tzOffset >= 0 ? '+' : ''}${tzOffset}`;

  container.innerHTML = `
    <div class="input-section glass-panel">
      <div class="section-header">
        <span class="section-icon">📅</span>
        <h2>選擇時間</h2>
      </div>
      <div class="input-grid">
        <div class="input-group">
          <label for="date-input" id="date-label">
            <span class="label-icon">🗓️</span> 公曆日期
          </label>
          <input
            type="date"
            id="date-input"
            aria-labelledby="date-label"
            value="${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}"
          />
        </div>
        <div class="input-group">
          <label for="time-input" id="time-label">
            <span class="label-icon">🕐</span> 時間
          </label>
          <input
            type="time"
            id="time-input"
            aria-labelledby="time-label"
            value="${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}"
          />
        </div>
        <div class="input-group">
          <label for="tz-display" id="tz-label">
            <span class="label-icon">🌐</span> 時區
          </label>
          <div class="tz-display" id="tz-display" aria-labelledby="tz-label">
            ${tzString}
          </div>
        </div>
      </div>
      <div class="input-actions">
        <button id="calc-btn" class="btn btn-primary" aria-label="開始計算">
          <span class="btn-icon">🔮</span> 開始占卜
        </button>
        <button id="now-btn" class="btn btn-secondary" aria-label="使用當前時間">
          <span class="btn-icon">⏰</span> 用當前時間
        </button>
        <button id="reset-btn" class="btn btn-ghost" aria-label="重置">
          <span class="btn-icon">🔄</span> 重置
        </button>
      </div>
    </div>
  `;

  const dateInput = container.querySelector('#date-input');
  const timeInput = container.querySelector('#time-input');
  const calcBtn = container.querySelector('#calc-btn');
  const nowBtn = container.querySelector('#now-btn');
  const resetBtn = container.querySelector('#reset-btn');

  function getSelectedDate() {
    const dateVal = dateInput.value;
    const timeVal = timeInput.value;
    if (!dateVal) return null;
    const [y, m, d] = dateVal.split('-').map(Number);
    const [h, min] = (timeVal || '12:00').split(':').map(Number);
    return new Date(y, m - 1, d, h, min);
  }

  calcBtn.addEventListener('click', () => {
    const date = getSelectedDate();
    if (!date || isNaN(date.getTime())) {
      showToast('請輸入有效的日期與時間', 'error');
      return;
    }
    // 添加按鈕動畫
    calcBtn.classList.add('btn-pulse');
    setTimeout(() => calcBtn.classList.remove('btn-pulse'), 600);
    onChange(date);
  });

  nowBtn.addEventListener('click', () => {
    const now = new Date();
    dateInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    timeInput.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    onChange(now);
  });

  resetBtn.addEventListener('click', () => {
    const now = new Date();
    dateInput.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    timeInput.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    // 清除結果區域
    document.querySelectorAll('.result-area').forEach(el => {
      el.classList.remove('visible');
    });
  });

  // 按 Enter 自動計算
  [dateInput, timeInput].forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        calcBtn.click();
      }
    });
  });
}

function showToast(msg, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('visible'));
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
