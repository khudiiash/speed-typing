<template>
  <div class="progress-container">
    <h2>{{ t.progress }}</h2>
    
    <div class="progress-stats">
      <div class="progress-stat">
        <div class="progress-stat-value">{{ bestSpeed }}</div>
        <div class="progress-stat-label">{{ t.bestSpeed }} ({{ t.wpm }})</div>
      </div>
      
      <div class="progress-stat">
        <div class="progress-stat-value">{{ averageSpeed }}</div>
        <div class="progress-stat-label">{{ t.averageSpeed }} ({{ t.wpm }})</div>
      </div>
      
      <div class="progress-stat">
        <div class="progress-stat-value">{{ sessionsCount }}</div>
        <div class="progress-stat-label">{{ t.sessionsCompleted }}</div>
      </div>
    </div>
    
    <div class="time-filter">
      <button
        v-for="filter in timeFilters"
        :key="filter"
        @click="$emit('filter-change', filter)"
        :class="['filter-btn', { active: currentFilter === filter }]"
      >
        {{ t[filter] }}
      </button>
    </div>
    
    <div class="chart-container" v-if="chartData.length > 0">
      <div class="chart">
        <div
          v-for="(point, index) in chartData"
          :key="index"
          class="chart-bar"
          :style="{ height: `${(point.wpm / maxWpm) * 100}%` }"
          :title="`${point.wpm} WPM - ${formatDate(point.timestamp)}`"
        ></div>
      </div>
    </div>
    
    <div v-else class="no-data">
      {{ t.noData || 'No data available' }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  sessions: {
    type: Array,
    default: () => [],
  },
  currentFilter: {
    type: String,
    default: 'allTime',
  },
  t: {
    type: Object,
    required: true,
  },
});

defineEmits(['filter-change']);

const timeFilters = ['today', 'thisWeek', 'allTime'];

const filteredSessions = computed(() => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const weekMs = 7 * dayMs;
  
  return props.sessions.filter(session => {
    if (props.currentFilter === 'allTime') return true;
    if (props.currentFilter === 'today') {
      return (now - session.timestamp) < dayMs;
    }
    if (props.currentFilter === 'thisWeek') {
      return (now - session.timestamp) < weekMs;
    }
    return true;
  });
});

const bestSpeed = computed(() => {
  if (filteredSessions.value.length === 0) return 0;
  return Math.max(...filteredSessions.value.map(s => s.wpm));
});

const averageSpeed = computed(() => {
  if (filteredSessions.value.length === 0) return 0;
  const sum = filteredSessions.value.reduce((acc, s) => acc + s.wpm, 0);
  return Math.round(sum / filteredSessions.value.length);
});

const sessionsCount = computed(() => filteredSessions.value.length);

const chartData = computed(() => {
  return filteredSessions.value
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-20); 
});

const maxWpm = computed(() => {
  if (chartData.value.length === 0) return 100;
  return Math.max(...chartData.value.map(d => d.wpm), 50);
});

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString();
}
</script>

<style scoped>
.progress-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h2 {
  margin-bottom: 2rem;
  font-size: 2rem;
}

.progress-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.progress-stat {
  background: var(--card-bg, #2a2a2a);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  border: 2px solid var(--card-border, #333);
}

.progress-stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--accent-color, #4ecdc4);
  margin-bottom: 0.5rem;
}

.progress-stat-label {
  font-size: 0.85rem;
  color: var(--text-secondary, #aaa);
}

.time-filter {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.filter-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  border: 2px solid var(--card-border, #333);
  background: var(--card-bg, #2a2a2a);
  color: var(--text-color, #fff);
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--accent-color, #4ecdc4);
}

.filter-btn.active {
  background: var(--accent-color, #4ecdc4);
  border-color: var(--accent-color, #4ecdc4);
  color: white;
}

.chart-container {
  background: var(--card-bg, #2a2a2a);
  border-radius: 8px;
  padding: 2rem;
  border: 2px solid var(--card-border, #333);
  min-height: 300px;
}

.chart {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 250px;
  gap: 4px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, #4ecdc4, #45b7d1);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.chart-bar:hover {
  opacity: 0.8;
  transform: scaleY(1.05);
}

.no-data {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary, #aaa);
  background: var(--card-bg, #2a2a2a);
  border-radius: 8px;
  border: 2px solid var(--card-border, #333);
}

@media (max-width: 768px) {
  .progress-stats {
    grid-template-columns: 1fr;
  }
  
  .time-filter {
    flex-direction: column;
  }
  
  .filter-btn {
    width: 100%;
  }
}
</style>
