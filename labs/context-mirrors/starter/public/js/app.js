/**
 * Echo Chamber - Frontend Application
 * Interactive web interface for sequence analysis
 */

// ===== State Management =====
const state = {
  currentSequence: [],
  currentResult: null,
  history: [],
  statistics: {
    total: 0,
    success: 0,
    patternCounts: {}
  }
};

// ===== Chart Instances =====
let sequenceChart = null;
let patternChart = null;

// ===== DOM Elements =====
const elements = {
  sequenceInput: document.getElementById('sequence-input'),
  analyzeBtn: document.getElementById('analyze-btn'),
  predictMoreBtn: document.getElementById('predict-more-btn'),
  resultSection: document.getElementById('result-section'),
  resultIcon: document.getElementById('result-icon'),
  resultTitle: document.getElementById('result-title'),
  resultContent: document.getElementById('result-content'),
  historyList: document.getElementById('history-list'),
  clearHistoryBtn: document.getElementById('clear-history-btn'),
  statTotal: document.getElementById('stat-total'),
  statSuccess: document.getElementById('stat-success'),
  statTime: document.getElementById('stat-time'),
  statCommon: document.getElementById('stat-common'),
  spellBtns: document.querySelectorAll('.spell-btn')
};

// ===== API Functions =====
async function analyzeSequence(sequence) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sequence })
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error de conexión con el servidor' };
  }
}

async function predictMore(sequence, count = 5) {
  try {
    const response = await fetch('/api/predict-multiple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sequence, count })
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Error de conexión con el servidor' };
  }
}

async function getStatistics() {
  try {
    const response = await fetch('/api/statistics');
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function getHistory() {
  try {
    const response = await fetch('/api/history');
    return await response.json();
  } catch (error) {
    return { history: [] };
  }
}

async function clearHistory() {
  try {
    await fetch('/api/history', { method: 'DELETE' });
    return true;
  } catch (error) {
    return false;
  }
}

// ===== UI Functions =====
function parseSequence(input) {
  return input.split(',').map(n => {
    const num = parseFloat(n.trim());
    if (isNaN(num)) throw new Error('Número inválido');
    return num;
  });
}

function showResult(result) {
  elements.resultSection.classList.remove('hidden', 'success', 'error');
  
  if (result.success) {
    elements.resultSection.classList.add('success');
    elements.resultIcon.textContent = '✅';
    elements.resultTitle.textContent = 'Patrón Detectado';
    
    const patternNames = {
      arithmetic: 'Progresión Aritmética',
      geometric: 'Progresión Geométrica',
      quadratic: 'Secuencia Cuadrática',
      cubic: 'Secuencia Cúbica',
      fibonacci: 'Secuencia de Fibonacci'
    };
    
    elements.resultContent.innerHTML = `
      <div class="pattern-type">${patternNames[result.pattern] || result.pattern}</div>
      ${result.formula ? `<div class="formula">${result.formula}</div>` : ''}
      <p><strong>Confianza:</strong> ${(result.confidence * 100).toFixed(0)}%</p>
      <p><strong>Próximo valor:</strong> <span class="prediction">${result.nextValue}</span></p>
      ${result.predictions ? `
        <p><strong>Secuencia extendida:</strong></p>
        <p class="formula">[${result.extendedSequence.join(', ')}]</p>
      ` : ''}
      <p><strong>Tiempo de procesamiento:</strong> ${result.processingTime?.toFixed(2) || 0}ms</p>
    `;
  } else {
    elements.resultSection.classList.add('error');
    elements.resultIcon.textContent = '❌';
    elements.resultTitle.textContent = 'Error';
    elements.resultContent.innerHTML = `<p>${result.error || 'No se pudo detectar el patrón'}</p>`;
  }
}

function updateChart(sequence, predictions = []) {
  const ctx = document.getElementById('sequence-chart').getContext('2d');
  
  const labels = [];
  const originalData = [];
  const predictionData = [];
  
  // Original sequence
  for (let i = 0; i < sequence.length; i++) {
    labels.push(i + 1);
    originalData.push(sequence[i]);
    predictionData.push(null);
  }
  
  // Predictions
  for (let i = 0; i < predictions.length; i++) {
    labels.push(sequence.length + i + 1);
    originalData.push(null);
    predictionData.push(predictions[i]);
  }
  
  // Connect last original to first prediction
  if (predictions.length > 0) {
    predictionData[sequence.length - 1] = sequence[sequence.length - 1];
  }
  
  if (sequenceChart) {
    sequenceChart.destroy();
  }
  
  sequenceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Secuencia Original',
          data: originalData,
          borderColor: '#9b59b6',
          backgroundColor: 'rgba(155, 89, 182, 0.2)',
          borderWidth: 3,
          pointBackgroundColor: '#9b59b6',
          pointRadius: 6,
          tension: 0.1
        },
        {
          label: 'Predicciones',
          data: predictionData,
          borderColor: '#f1c40f',
          backgroundColor: 'rgba(241, 196, 15, 0.2)',
          borderWidth: 3,
          borderDash: [5, 5],
          pointBackgroundColor: '#f1c40f',
          pointRadius: 6,
          tension: 0.1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: '#ecf0f1' }
        }
      },
      scales: {
        x: {
          title: { display: true, text: 'Posición', color: '#888' },
          ticks: { color: '#888' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        },
        y: {
          title: { display: true, text: 'Valor', color: '#888' },
          ticks: { color: '#888' },
          grid: { color: 'rgba(255,255,255,0.1)' }
        }
      }
    }
  });
  
  document.getElementById('chart-legend').textContent = 
    `Visualizando ${sequence.length} valores originales` + 
    (predictions.length > 0 ? ` + ${predictions.length} predicciones` : '');
}

function updatePatternChart(patternCounts) {
  const ctx = document.getElementById('pattern-chart').getContext('2d');
  
  const patternNames = {
    arithmetic: 'Aritmética',
    geometric: 'Geométrica',
    quadratic: 'Cuadrática',
    cubic: 'Cúbica',
    fibonacci: 'Fibonacci'
  };
  
  const labels = Object.keys(patternCounts).map(k => patternNames[k] || k);
  const data = Object.values(patternCounts);
  const colors = ['#9b59b6', '#3498db', '#27ae60', '#e74c3c', '#f1c40f'];
  
  if (patternChart) {
    patternChart.destroy();
  }
  
  patternChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors.slice(0, data.length),
        borderColor: '#1a1a2e',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#ecf0f1', padding: 15 }
        }
      }
    }
  });
}

function updateStatistics(stats) {
  elements.statTotal.textContent = stats.totalAnalyzed || 0;
  elements.statSuccess.textContent = `${(stats.successRate || 0).toFixed(0)}%`;
  elements.statTime.textContent = `${(stats.averageProcessingTime || 0).toFixed(2)}ms`;
  elements.statCommon.textContent = stats.mostCommonPattern || '-';
  
  if (stats.patternCounts && Object.keys(stats.patternCounts).length > 0) {
    updatePatternChart(stats.patternCounts);
  }
}

function updateHistoryList(history) {
  if (!history || history.length === 0) {
    elements.historyList.innerHTML = '<p class="empty-state">Los pergaminos están vacíos. ¡Comienza a analizar secuencias!</p>';
    return;
  }
  
  const patternNames = {
    arithmetic: 'Aritmética',
    geometric: 'Geométrica',
    quadratic: 'Cuadrática',
    cubic: 'Cúbica',
    fibonacci: 'Fibonacci'
  };
  
  elements.historyList.innerHTML = history.slice().reverse().slice(0, 20).map(item => `
    <div class="history-item">
      <span class="timestamp">${new Date(item.timestamp).toLocaleString()}</span>
      <p class="sequence">[${item.sequence.join(', ')}]</p>
      ${item.success ? 
        `<span class="pattern-badge">${patternNames[item.result.pattern] || item.result.pattern} → ${item.result.nextValue}</span>` :
        '<span class="pattern-badge" style="background: #e74c3c;">Error</span>'
      }
    </div>
  `).join('');
}

async function refreshData() {
  const [statsData, historyData] = await Promise.all([
    getStatistics(),
    getHistory()
  ]);
  
  if (statsData) {
    updateStatistics(statsData);
  }
  
  if (historyData && historyData.history) {
    updateHistoryList(historyData.history);
  }
}

// ===== Event Handlers =====
elements.analyzeBtn.addEventListener('click', async () => {
  try {
    const sequence = parseSequence(elements.sequenceInput.value);
    state.currentSequence = sequence;
    
    const result = await analyzeSequence(sequence);
    state.currentResult = result;
    
    showResult(result);
    updateChart(sequence, result.predictions || []);
    await refreshData();
  } catch (error) {
    showResult({ success: false, error: error.message });
  }
});

elements.predictMoreBtn.addEventListener('click', async () => {
  try {
    const sequence = parseSequence(elements.sequenceInput.value);
    state.currentSequence = sequence;
    
    const result = await predictMore(sequence, 5);
    state.currentResult = result;
    
    showResult(result);
    if (result.success) {
      updateChart(sequence, result.predictions);
    }
    await refreshData();
  } catch (error) {
    showResult({ success: false, error: error.message });
  }
});

elements.sequenceInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    elements.analyzeBtn.click();
  }
});

elements.spellBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    elements.sequenceInput.value = btn.dataset.sequence;
    elements.analyzeBtn.click();
  });
});

elements.clearHistoryBtn.addEventListener('click', async () => {
  if (confirm('¿Estás seguro de que deseas limpiar todo el historial?')) {
    await clearHistory();
    await refreshData();
  }
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
  refreshData();
  
  // Initialize empty chart
  updateChart([1, 2, 3, 4, 5], []);
});
