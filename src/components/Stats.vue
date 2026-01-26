<template>
  <div class="stats-container">
    <!-- Main Stats Grid -->
    <div class="main-stats-grid">
      <!-- Column 1: Speed -->
      <div class="stats-column">
        <div class="stat-item">
          <div class="stat-label">{{ t.wpm }}</div>
          <div class="stat-value">{{ stats.wpm }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">{{ t.cpm }}</div>
          <div class="stat-value">{{ stats.cpm || 0 }}</div>
        </div>
      </div>

      <div class="separator-vertical"></div>

      <!-- Column 2: Quality -->
      <div class="stats-column">
        <div class="stat-item">
          <div class="stat-label">{{ t.accuracy }}</div>
          <div class="stat-value">{{ Math.round(stats.accuracy) }}%</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">{{ t.mistakes }}</div>
          <div class="stat-value">{{ stats.totalMistakes || stats.mistakes }}</div>
        </div>
      </div>

      <div class="separator-vertical"></div>

      <!-- Column 3: Results -->
      <div class="stats-column">
        <div class="stat-item">
          <div class="stat-label">{{ t.longestSequence }}</div>
          <div class="stat-value">{{ stats.maxCombo || 0 }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">{{ t.time }}</div>
          <div class="stat-value">{{ formatTime(stats.time) }}</div>
        </div>
      </div>
    </div>

    <div class="separator-horizontal"></div>

    <!-- Bottom Section: Averages and Graph -->
    <div class="bottom-section">
      <!-- Averages -->
      <div class="averages-section">
        <div class="section-title">
          {{ t.averageValues }}
        </div>
        <div class="averages-grid">
          <div class="average-item">
            <div class="average-label">{{ t.wpm }}</div>
            <div class="average-value">
              <span class="average-number">{{ allTimeAverageWpm }}</span>
              <span class="wpm-unit">/wpm</span>
              <span v-if="allSessions.length > 0 && wpmImprovement !== 0" class="improvement" :class="wpmImprovement > 0 ? 'positive' : 'negative'">
                <span v-if="wpmImprovement > 0">↑</span>
                <span v-else>↓</span>
                {{ Math.abs(wpmImprovement) }}%
              </span>
            </div>
          </div>
          <div class="separator-vertical-small"></div>
          <div class="average-item">
            <div class="average-label">{{ t.accuracy }}</div>
            <div class="average-value">
              <span class="average-number">{{ Math.round(allTimeAverageAccuracy) }}</span>
              <span class="wpm-unit">%</span>
              <span v-if="allSessions.length > 0 && accuracyImprovement !== 0" class="improvement" :class="accuracyImprovement > 0 ? 'positive' : 'negative'">
                <span v-if="accuracyImprovement > 0">↑</span>
                <span v-else>↓</span>
                {{ Math.abs(accuracyImprovement) }}%
              </span>
            </div>
          </div>
          <div class="separator-vertical-small"></div>
          <div class="average-item">
            <div class="average-label">{{ t.longestSequence }}</div>
            <div class="average-value">
              <span class="average-number">{{ allTimeAverageLongestSequence }}</span>
              <span v-if="allSessions.length > 0 && longestSequenceImprovement !== 0" class="improvement" :class="longestSequenceImprovement > 0 ? 'positive' : 'negative'">
                <span v-if="longestSequenceImprovement > 0">↑</span>
                <span v-else>↓</span>
                {{ Math.abs(longestSequenceImprovement) }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="separator-vertical-small"></div>

      <!-- Graph -->
      <div class="graph-section">
        <div class="section-title">
          {{ t.speedOverTime || t.wordsPerMinute }}
        </div>
        <div class="graph-container" v-if="chartData.length > 0">
          <div class="graph">
            <svg class="graph-svg" viewBox="0 0 400 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#9b59b6;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#9b59b6;stop-opacity:0.3" />
                </linearGradient>
              </defs>
              <path
                :d="smoothPath"
                fill="none"
                stroke="#9b59b6"
                stroke-width="2"
                vector-effect="non-scaling-stroke"
              />
              <path
                v-if="smoothPolygonPath"
                :d="smoothPolygonPath"
                fill="url(#lineGradient)"
                opacity="0.3"
              />
            </svg>
            <div class="graph-labels">
              <div class="graph-y-labels">
                <span v-for="label in yLabels" :key="label">{{ label }}</span>
              </div>
              <div class="graph-x-labels">
                <span v-for="(label, index) in xLabels" :key="index">{{ label }}</span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-data">
          {{ t.noData }}
        </div>
      </div>
    </div>
    
    <div class="stats-actions">
      <div class="restart-hint">{{ t.pressEnterToRestart }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  stats: {
    type: Object,
    required: true,
  },
  allSessions: {
    type: Array,
    default: () => [],
  },
  t: {
    type: Object,
    required: true,
  },
  language: {
    type: String,
    default: 'en',
  },
});

defineEmits(['new-session', 'back-to-menu']);

function formatTime(seconds) {
  if (!seconds) return '0s';
  const totalSeconds = Math.floor(seconds);
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}m ${secs}s`;
}

const allTimeAverageWpm = computed(() => {
  if (props.allSessions.length === 0) return 0;
  const sum = props.allSessions.reduce((acc, s) => acc + s.wpm, 0);
  return Math.round(sum / props.allSessions.length);
});

const allTimeAverageAccuracy = computed(() => {
  if (props.allSessions.length === 0) return 0;
  const sum = props.allSessions.reduce((acc, s) => acc + (s.accuracy || 0), 0);
  return Math.round((sum / props.allSessions.length) * 100) / 100;
});

const allTimeAverageLongestSequence = computed(() => {
  if (props.allSessions.length === 0) return 0;
  const sum = props.allSessions.reduce((acc, s) => acc + (s.maxCombo || 0), 0);
  return Math.round(sum / props.allSessions.length);
});

const wpmImprovement = computed(() => {
  const currentWpm = props.stats.wpm || 0;
  const avg = allTimeAverageWpm.value;
  if (avg === 0 || currentWpm === 0) return 0;
  return Math.round(((currentWpm - avg) / avg) * 100);
});

const accuracyImprovement = computed(() => {
  const currentAccuracy = props.stats.accuracy || 0;
  const avg = allTimeAverageAccuracy.value;
  if (avg === 0 || currentAccuracy === 0) return 0;
  return Math.round(((currentAccuracy - avg) / avg) * 100);
});

const longestSequenceImprovement = computed(() => {
  const currentLongest = props.stats.maxCombo || 0;
  const avg = allTimeAverageLongestSequence.value;
  if (avg === 0 || currentLongest === 0) return 0;
  return Math.round(((currentLongest - avg) / avg) * 100);
});


function smoothData(data, windowSize = 3) {
  if (data.length === 0) return [];
  if (data.length <= windowSize) return data;
  
  const smoothed = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
    const window = data.slice(start, end);
    const avg = window.reduce((sum, p) => sum + p.wpm, 0) / window.length;
    smoothed.push({ ...data[i], wpm: Math.round(avg) });
  }
  return smoothed;
}

const chartData = computed(() => {
  
  const sorted = [...props.allSessions]
    .sort((a, b) => a.timestamp - b.timestamp);
  
  return smoothData(sorted, 3);
});

const maxWpm = computed(() => {
  if (chartData.value.length === 0) return 100;
  return Math.max(...chartData.value.map(d => d.wpm), 50);
});


function createSmoothPath(points, width, height, max) {
  if (points.length === 0) return '';
  if (points.length === 1) {
    const x = 0;
    const y = height - (points[0].wpm / max) * height;
    return `M ${x},${y}`;
  }
  
  let path = '';
  for (let i = 0; i < points.length; i++) {
    const x = points.length > 1 ? (i / (points.length - 1)) * width : 0;
    const y = height - (points[i].wpm / max) * height;
    
    if (i === 0) {
      path += `M ${x},${y} `;
    } else {
      const prevX = ((i - 1) / (points.length - 1)) * width;
      const prevY = height - (points[i - 1].wpm / max) * height;
      
      
      const cp1x = prevX + (x - prevX) / 2;
      const cp1y = prevY;
      const cp2x = prevX + (x - prevX) / 2;
      const cp2y = y;
      
      path += `C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y} `;
    }
  }
  return path.trim();
}

const smoothPath = computed(() => {
  if (chartData.value.length === 0) return '';
  const max = Math.max(maxWpm.value, 50);
  const width = 400;
  const height = 150;
  return createSmoothPath(chartData.value, width, height, max);
});

const smoothPolygonPath = computed(() => {
  if (chartData.value.length === 0 || !smoothPath.value) return '';
  const width = 400;
  const height = 150;
  const firstX = 0;
  const lastX = width;
  return `${smoothPath.value} L ${lastX},${height} L ${firstX},${height} Z`;
});

const yLabels = computed(() => {
  const max = Math.max(Math.ceil(maxWpm.value / 20) * 20, 60);
  const step = max / 5;
  return [
    max,
    Math.round(max - step),
    Math.round(max - step * 2),
    Math.round(max - step * 3),
    Math.round(max - step * 4),
    0
  ];
});

const xLabels = computed(() => {
  if (chartData.value.length === 0) return [];
  const count = Math.min(chartData.value.length, 8);
  if (count === 0) return [];
  const step = chartData.value.length > 1 ? (chartData.value.length - 1) / (count - 1) : 0;
  const labels = [];
  
  for (let i = 0; i < count; i++) {
    const index = Math.round(i * step);
    if (index < chartData.value.length) {
      const session = chartData.value[index];
      const date = new Date(session.timestamp);
      labels.push(formatDateLabel(date, i === 0 || i === count - 1));
    }
  }
  return labels;
});

function formatDateLabel(date, showFull = false) {
  const now = new Date();
  const diffTime = now - date;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const locale = props.language === 'uk' ? 'uk-UA' : 'en-US';
  
  if (diffDays === 0) {
    return props.t.today;
  } else if (diffDays === 1) {
    return `1${props.t.daysAgo}`;
  } else if (diffDays < 7) {
    return `${diffDays}${props.t.daysAgo}`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}${props.t.weeksAgo}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months}${props.t.monthsAgo}`;
  } else {
    if (showFull) {
      return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString(locale, { month: 'short' });
    }
  }
}
</script>

<style scoped>
.stats-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

/* Main Stats Grid - 3 columns */
.main-stats-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  gap: 0;
  align-items: start;
  flex-shrink: 0;
}

.stats-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.75rem;
  justify-content: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary, #aaa);
  text-transform: lowercase;
  letter-spacing: 0.2px;
}

.stat-value {
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--text-color, #fff);
  line-height: 1.1;
}

/* Separators */
.separator-vertical {
  width: 1px;
  background: var(--card-border, #333);
  margin: 0.5rem 0;
  align-self: stretch;
}

.separator-vertical-small {
  width: 1px;
  background: var(--card-border, #333);
  margin: 0 0.75rem;
  align-self: stretch;
}

.separator-horizontal {
  height: 1px;
  background: var(--card-border, #444);
  width: 100%;
  margin: 0.5rem 0;
}

/* Bottom Section: Averages and Graph */
.bottom-section {
  display: grid;
  grid-template-columns: auto 1px 1fr;
  gap: 0;
  align-items: start;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.averages-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  min-width: 280px;
  flex: 0 0 auto;
}

.section-title {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-secondary, #aaa);
  text-transform: lowercase;
  letter-spacing: 0.3px;
  margin-bottom: 0.5rem;
}

.averages-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.average-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.average-label {
  font-size: 0.75rem;
  color: var(--text-secondary, #aaa);
  text-transform: lowercase;
  letter-spacing: 0.2px;
}

.average-value {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.average-number {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-color, #fff);
}

.wpm-unit {
  font-size: 1rem;
  color: var(--text-secondary, #aaa);
  font-weight: normal;
}

.improvement {
  font-size: 0.9rem;
  font-weight: normal;
}

.improvement.positive {
  color: #4ecdc4;
}

.improvement.negative {
  color: #ff6b6b;
}

/* Graph Section */
.graph-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.graph-container {
  flex: 1;
  min-height: 0;
  position: relative;
  padding: 0.5rem 0.5rem 1.5rem 1.5rem;
}

.graph {
  width: 100%;
  height: 100%;
  min-height: 120px;
  position: relative;
}

.graph-svg {
  width: 100%;
  height: 100%;
  min-height: 120px;
  display: block;
}

.graph-labels {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.graph-y-labels {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.25rem 0;
  font-size: 0.6rem;
  color: var(--text-secondary, #aaa);
}

.graph-x-labels {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  font-size: 0.6rem;
  color: var(--text-secondary, #aaa);
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary, #aaa);
  font-size: 0.8rem;
}

.stats-actions {
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  padding-top: 0.75rem;
}

.restart-hint {
  font-size: 0.85rem;
  color: var(--text-secondary, #aaa);
  text-transform: lowercase;
  letter-spacing: 0.3px;
}

@media (max-width: 1024px) {
  .main-stats-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .separator-vertical {
    width: 100%;
    height: 1px;
    margin: 0.5rem 0;
  }
  
  .bottom-section {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .separator-vertical-small {
    width: 100%;
    height: 1px;
    margin: 0.5rem 0;
  }
  
  .averages-section {
    min-width: auto;
  }
  
  .averages-grid {
    flex-direction: row;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .stats-container {
    padding: 0.75rem;
  }
  
  .stat-value {
    font-size: 1.3rem;
  }
  
}
</style>
