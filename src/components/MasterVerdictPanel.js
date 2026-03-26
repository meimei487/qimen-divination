export function createMasterVerdictPanel(container, verdictData) {
  const { title, color, lines } = verdictData;
  
  // 建立大師總評區塊的 HTML
  const linesHtml = lines.map(line => {
    // 簡單的 markdown 加粗轉換 **粗體** 
    const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<span style="color:#ffd700;font-weight:bold;">$1</span>');
    return `<div class="verdict-line" style="margin-bottom: 12px; line-height: 1.6;">${formattedLine}</div>`;
  }).join('');

  container.innerHTML = `
    <div class="result-box glass-panel" style="margin-bottom: 24px; border-left: 4px solid ${color}; padding: 20px;">
      <div class="section-header" style="margin-bottom: 16px;">
        <span class="section-icon">📜</span>
        <h2 style="color: ${color}; font-size: 1.25rem;">大師總評：${title}</h2>
      </div>
      <div class="verdict-content" style="color: rgba(255,255,255,0.9); font-size: 0.95rem;">
        ${linesHtml}
      </div>
    </div>
  `;
}
